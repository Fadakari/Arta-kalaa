import api from "@/services/api";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("access_token")?.value;
        if (!token) return new Response("Unauthorized", { status: 401 });

        const body = await req.json();
        const res = await api.post(`/home/discounted-order/create/`, body, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return new Response(JSON.stringify(res.data), {
            status: res.status,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error: any) {
        const errorMessage = error?.response?.data?.error || "خطای ناشناخته";
        const statusCode = error?.response?.status || 500;

        return new Response(
            JSON.stringify({ success: false, message: errorMessage }),
            {
                status: statusCode,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
