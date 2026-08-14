import api from "@/services/api";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
        return NextResponse.json({ error: "توکن یافت نشد" }, { status: 401 });
    }

    const body = await request.json();
    try {
        const result = await api.post(
            "/users/change-password/",
            body,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return NextResponse.json(result.data);
    } catch (error: any) {
        const data = error?.response?.data;
        return NextResponse.json(
            { errors: data },
            { status: error?.response?.status || 400 }
        );
    }
}