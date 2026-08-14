import { NextResponse } from "next/server";
import api from "@/services/api";
import { isProductionSite } from "@/lib/urls";

export async function POST(req: Request) {
    try {
        const { refresh } = await req.json();

        if (!refresh) {
            return NextResponse.json({ error: "No refresh token" }, { status: 401 });
        }

        const response = await api.post("/users/token/refresh/", { refresh });

        const { access, refresh: newRefresh } = response.data;

        const dashboardResponse = await api.get("/users/dashboard/", {
            headers: {
                Authorization: `Bearer ${access}`,
            },
        });

        const res = NextResponse.json({
            success: true,
            access,
            refresh: newRefresh || refresh,
            dashboard: dashboardResponse.data,
        });

        res.cookies.set("access_token", access, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
            secure: isProductionSite(),
            sameSite: "lax",
        });
        res.cookies.set("refresh_token", newRefresh, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 24 * 30,
            secure: isProductionSite(),
            sameSite: "lax",
        });
        return res;
    } catch (error: any) {
        console.log("Refresh error:", error.response?.data || error.message);
        return NextResponse.json({ error: "Refresh failed" }, { status: 401 });
    }
}
