import api from "@/services/api";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      console.log("[DEBUG] No token found in cookies");
      return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
    }

    const body = await req.json();
    console.log("[DEBUG] Request body:", JSON.stringify(body, null, 2));

    const res = await api.post(`/shop/order/create/`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("[DEBUG] API response data:", JSON.stringify(res.data, null, 2));

    return new Response(JSON.stringify(res.data), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("[DEBUG] Error caught in POST /api/order:", {
      message: error?.message,
      responseData: error?.response?.data,
      responseStatus: error?.response?.status,
      stack: error?.stack,
    });

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
