import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import api from "@/services/api";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await api.get("/users/dashboard/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return NextResponse.json(result.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.response?.data?.message || "خطا در دریافت اطلاعات کاربر" },
      { status: error?.response?.status || 500 }
    );
  }
}
