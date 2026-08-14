import api from "@/services/api";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (!token) return new Response("Unauthorized", { status: 401 });

    const res = await api.get(`/home/discounted-cart/`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return new Response(JSON.stringify(res.data), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
    });
}

export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("access_token")?.value;
        if (!token) return new Response("Unauthorized", { status: 401 });

        const body = await req.json();

        const res = await api.post(`/home/discounted-cart/add/`, body, {
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
        console.log(errorMessage)
        return new Response(JSON.stringify({ error: errorMessage }), {
            status: statusCode,
            headers: { "Content-Type": "application/json" },
        });
    }
}


export async function PATCH(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("access_token")?.value;
        if (!token) return new Response("Unauthorized", { status: 401 });

        const body = await req.json();
        const { id, ...rest } = body;

        if (!id) return new Response("Missing item ID", { status: 400 });

        const res = await api.patch(`/home/discounted-cart/update/${id}/`, rest, {
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

        return new Response(JSON.stringify({ error: errorMessage }), {
            status: statusCode,
            headers: { "Content-Type": "application/json" },
        });
    }
}


export async function DELETE(req: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;
    if (!token) return new Response("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return new Response("Missing item ID", { status: 400 });

    const res = await api.delete(`/home/discounted-cart/remove/${id}/`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
    return new Response(JSON.stringify(res.data), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
    });
}
