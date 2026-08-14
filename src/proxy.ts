// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export default function proxy(req: NextRequest) {
    const token = req.cookies.get("access_token")?.value;

    const url = req.nextUrl.clone();
    const pathname = url.pathname;

    if (pathname.startsWith("/marketer") ) {
        if (!token) {
            url.pathname = "/";
            return NextResponse.redirect(url);
        }

    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/marketer/:path*"],
};
