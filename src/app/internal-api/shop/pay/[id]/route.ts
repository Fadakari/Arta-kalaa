import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import api from "@/services/api";

export async function POST(
    req: NextRequest,
    { params }: { params: any }
) {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
        return new Response(
            JSON.stringify({ success: false, message: "Unauthorized" }),
            { status: 401, headers: { "Content-Type": "application/json" } }
        );
    }

    try {
        const { id } = await params;
        const res = await api.post(`/payments/go-to-gateways/${id}`, null, {
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
        const statusCode = error?.response?.status || 500;
        const errorMessage = error?.response?.data?.error || "خطای ناشناخته";

        return new Response(
            JSON.stringify({ success: false, message: errorMessage }),
            { status: statusCode, headers: { "Content-Type": "application/json" } }
        );
    }
}

