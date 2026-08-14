import { NextResponse } from 'next/server'

export async function POST() {
    const response = new NextResponse(JSON.stringify({ message: 'Logged out' }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const isProd = process.env.NODE_ENV === "production";

    const cookieOptions = {
        httpOnly: true,
        path: "/",
        secure: isProd,
        sameSite: "lax",
        expires: new Date(0),
    } as const;

    response.cookies.set("access_token", "", cookieOptions);
    response.cookies.set("refresh_token", "", cookieOptions);

    return response;
}
