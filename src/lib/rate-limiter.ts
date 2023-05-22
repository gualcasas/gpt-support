import { UPSTASH_REDIS_TOKEN, UPSTASH_REDIS_URL } from "@/envVars";
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";

if (!UPSTASH_REDIS_TOKEN || !UPSTASH_REDIS_URL) {
    throw new Error("UPSTASH_REDIS_URL or UPSTASH_REDIS_TOKEN envVar missing");
}

const redis = new Redis({
    url: UPSTASH_REDIS_URL,
    token: UPSTASH_REDIS_TOKEN,
});

// Create a new ratelimiter, that allows 10 requests per 10 seconds
export const ratelimit = new Ratelimit({
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
