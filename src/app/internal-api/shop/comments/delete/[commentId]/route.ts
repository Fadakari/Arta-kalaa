import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import api from "@/services/api";

export async function DELETE(req: NextRequest, { params }: any) {
    const { commentId }: { commentId: string } = await params

    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }


    try {
        await api.delete(
            `/shop/comments/${commentId}/delete/`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );


        return new NextResponse(null, { status: 204 });

    } catch (error: any) {
        console.log(error)
        const status = error.response?.status || 500;
        const message =
            error.response?.data || { error: "خطای ناشناخته‌ای رخ داده است" };


        return NextResponse.json(message, { status });
    }
}
