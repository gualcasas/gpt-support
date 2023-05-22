import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ratelimit } from "@/lib/rate-limiter";

// Limit the middleware to paths starting with `/api/`
export const config = {
    matcher: "/api/message",
};

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
