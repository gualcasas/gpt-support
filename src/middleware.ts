import { UPSTASH_REDIS_TOKEN, UPSTASH_REDIS_URL } from "@/envVars";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";

if (!UPSTASH_REDIS_TOKEN || !UPSTASH_REDIS_URL) {
    throw new Error("UPSTASH_REDIS_URL or UPSTASH_REDIS_TOKEN envVar missing");
}

const redis = new Redis({
    url: UPSTASH_REDIS_URL,
    token: UPSTASH_REDIS_TOKEN,
});

// Limit the middleware to paths starting with `/api/`
export const config = {
    matcher: "/api/message",
};

// Create a new ratelimiter, that allows 10 requests per 10 seconds
const ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(6, "60s"),
    analytics: true,
    /**
     * Optional prefix for the keys used in redis. This is useful if you want to share a redis
     * instance with other applications and want to avoid key collisions. The default prefix is
     * "@upstash/ratelimit"
     */
    prefix: "@upstash/ratelimit",
});

export async function middleware(request: NextRequest) {
    const identifier = request.ip ?? "127.0.0.1";

    const { success } = await ratelimit.limit(identifier);
    if (!success) {
        // Respond with JSON indicating an error message
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: "Rate limit reached",
            }),
            {
                status: 429,
                headers: {
                    "content-type": "application/json",
                },
            }
        );
    }
}
