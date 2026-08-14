// src/app/api/auth/verify-otp/route.ts
import { NextRequest, NextResponse } from "next/server";
import api from "@/services/api";
import { isProductionSite } from "@/lib/urls";

export async function POST(request: NextRequest) {
    // ─── ۱. دریافت و اعتبارسنجی داده‌ها ───
    const body = await request.json();
    const { phone_number, code, referral_code } = body;

    // اعتبارسنجی اولیه
    if (!phone_number || !code) {
        return NextResponse.json(
            { error: "شماره تلفن و کد تایید الزامی است" },
            { status: 400 }
        );
    }

    // ─── ۲. لاگ درخواست ───
    console.log("📤 Verify OTP Request:", {
        phone_number,
        code,
        referral_code: referral_code || "ندارد",
        url: "/users/otp/verify/"
    });

    try {
        // ─── ۳. ارسال به سرور ───
        // ✅ اصلاح: اطمینان از مسیر صحیح
        const res = await api.post("/users/otp/verify/", {
            phone_number,
            code,
            referral_code: referral_code || "",
        });

        // ─── ۴. لاگ پاسخ موفق ───
        console.log("✅ Verify OTP Response:", {
            status: res.status,
            hasAccess: !!res.data?.access,
            message: res.data?.message
        });

        const { access, message, refresh } = res.data;

        // ─── ۵. بررسی وجود توکن ───
        if (!access) {
            console.error("❌ No access token in response:", res.data);
            return NextResponse.json(
                { error: "توکن دسترسی دریافت نشد" },
                { status: 500 }
            );
        }

        // ─── ۶. ساخت پاسخ ───
        const response = NextResponse.json({
            message: message || "احراز هویت با موفقیت انجام شد",
            success: true
        });

        // ─── ۷. ذخیره توکن در کوکی ───
        response.cookies.set("access_token", access, {
            httpOnly: true,
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 روز
            secure: isProductionSite(),
            sameSite: "lax",
        });

        // اگر رفرش توکن هم دارید
        if (refresh) {
            response.cookies.set("refresh_token", refresh, {
                httpOnly: true,
                path: "/",
                maxAge: 60 * 60 * 24 * 30, // 30 روز
                secure: isProductionSite(),
                sameSite: "lax",
            });
        }

        return response;

    } catch (error: any) {
        // ─── ۸. لاگ کامل خطا ───
        console.error("❌ Verify OTP Error:", {
            message: error.message,
            status: error?.response?.status,
            data: error?.response?.data,
            config: error?.config,
            stack: error.stack
        });

        // ─── ۹. مدیریت خطاهای مختلف ───
        let errorMessage = "کد تأیید نامعتبر یا منقضی شده است";
        let statusCode = 500;

        if (error?.response) {
            statusCode = error.response.status || 500;
            
            // خطای 404 - مسیر پیدا نشد
            if (statusCode === 404) {
                errorMessage = "مسیر API پیدا نشد. لطفاً با پشتیبانی تماس بگیرید";
            }
            // خطای ۴۰۰ (Bad Request)
            else if (statusCode === 400) {
                errorMessage = error.response.data?.error || 
                              error.response.data?.message ||
                              "اطلاعات ارسال شده نامعتبر است";
            }
            // خطای ۴۲۹ (Too Many Requests)
            else if (statusCode === 429) {
                errorMessage = "تعداد درخواست‌های شما زیاد است. لطفاً چند دقیقه بعد تلاش کنید";
            }
            // خطای ۵۰۰
            else if (statusCode >= 500) {
                errorMessage = "خطای داخلی سرور. لطفاً بعداً تلاش کنید";
            }
        } else if (error?.request) {
            errorMessage = "سرور پاسخ نمی‌دهد. لطفاً بعداً تلاش کنید";
        } else {
            errorMessage = error.message || errorMessage;
        }

        return NextResponse.json(
            { 
                error: errorMessage,
                details: process.env.NODE_ENV === "development" ? error?.response?.data : undefined
            },
            { status: statusCode }
        );
    }
}