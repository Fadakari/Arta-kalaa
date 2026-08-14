import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import api from "@/services/api";

export async function POST(req: NextRequest, { params }: any) {
    const cookieStore = await cookies();
    const { productId }: { productId: string } = await params
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    try {
        const { data } = await api.post(`/shop/products/${productId}/comments/`,
            body,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return NextResponse.json(data);
    } catch (error: any) {
        const status = error.response?.status || 500;
        const message = error.response?.data || { error: "خطای ناشناخته‌ای رخ داده است" };

        return NextResponse.json(message, { status });
    }
}
