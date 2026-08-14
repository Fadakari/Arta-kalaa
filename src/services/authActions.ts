// src/services/authActions.ts
import { addToast } from "@heroui/toast";
import api, { fetchWithErrorHandling, ApiError } from "./api";


// ─── Helper Toast ──────────────────────────────────────
function showToast(
  title: string,
  options?: {
    description?: string;
    color?: "success" | "danger" | "warning";
  }
) {
  try {
    addToast({
      title,
      description: options?.description,
      color: options?.color || "success",
    });
  } catch {
    console.log(`[Toast] ${title}`);
  }
}

// ─── Auth Actions ────────────────────────────────

// ✅ ارسال کد OTP
export const sendOtp = async (phone_number: string) => {
  try {
    console.log('📤 [sendOtp] Sending OTP for:', phone_number);
    
    const result = await api.post("/users/otp/request/", { 
      phone_number 
    });

    if (result.status === 200 || result.status === 201) {
      showToast("کد تایید با موفقیت به شماره تلفن شما ارسال شد", {
        description: phone_number,
      });
      return result;
    }
    
    return result;
  } catch (error: any) {
    console.error('❌ [sendOtp] Error:', error);
    const message = error?.response?.data?.message || 
                    error?.response?.data?.error ||
                    "خطا در ارسال کد تایید";
    showToast(message, { color: "danger" });
    throw error;
  }
};

// ✅ تایید کد OTP - استفاده از api.post (یکسان با sendOtp)
export const verifyOtp = async (
  phone_number: string,
  code: string,
  referral_code?: string
) => {
  try {
    console.log('🔐 [verifyOtp] Verifying OTP for:', phone_number);
    console.log('🔐 [verifyOtp] Code:', code);
    
    // ✅ استفاده از api.post به جای fetchWithErrorHandling
    const response = await api.post("/users/otp/verify/", {
      phone_number,
      code,
      referral_code: referral_code || ""
    });

    console.log('✅ [verifyOtp] Success:', response.data);
    
    // ذخیره توکن‌ها
    if (response.data?.access) {
      localStorage.setItem('access_token', response.data.access);
      document.cookie = `access_token=${response.data.access}; path=/; max-age=604800`;
    }
    if (response.data?.refresh) {
      localStorage.setItem('refresh_token', response.data.refresh);
      document.cookie = `refresh_token=${response.data.refresh}; path=/; max-age=2592000`;
    }
    
    showToast(response.data?.message || "احراز هویت با موفقیت انجام شد");
    
    console.log("========== VERIFY RESPONSE ==========");
console.log(response.data);
console.log("====================================");

    
    return response.data;
  } catch (error: any) {
    console.error('❌ [verifyOtp] Error:', error);
    console.error('❌ Response:', error.response?.data);
    console.error('❌ Status:', error.response?.status);
    
    let message = "کد تایید نامعتبر یا منقضی شده است";
    
    if (error.response?.status === 404) {
      message = "مسیر احراز هویت یافت نشد";
    } else if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.response?.data?.error) {
      message = error.response.data.error;
    }
    
    showToast(message, {
      description: "لطفاً دوباره تلاش کنید",
      color: "danger",
    });
    
    throw error;
  }
};

// ✅ ورود با رمز عبور - استفاده از api.post
export const login = async (phone_number: string, password: string) => {
  try {
    console.log('🔑 [login] Login for:', phone_number);
    
    const response = await api.post("/users/login/password/", {
      phone_number,
      password,
    });

    console.log('✅ [login] Success:', response.data);
    
    if (response.data?.access) {
      localStorage.setItem('access_token', response.data.access);
      document.cookie = `access_token=${response.data.access}; path=/; max-age=604800`;
    }
    if (response.data?.refresh) {
      localStorage.setItem('refresh_token', response.data.refresh);
      document.cookie = `refresh_token=${response.data.refresh}; path=/; max-age=2592000`;
    }
    
    showToast(response.data?.message || "ورود با موفقیت انجام شد");
    
    setTimeout(() => {
      window.location.reload();
    }, 500);
    
    return response.data;
  } catch (error: any) {
    console.error('❌ [login] Error:', error);
    const message = error?.response?.data?.message || "خطا در ورود به حساب";
    showToast(message, { color: "danger" });
    throw error;
  }
};

// ✅ بررسی وجود کاربر
export async function checkPhoneExists(phone: string) {
  try {
    console.log('🔍 [checkPhoneExists] Checking phone:', phone);
    
    const response = await api.post("/users/check-user-status/", {
      phone_number: phone,
    });
    
    console.log('✅ [checkPhoneExists] Response:', response.data);
    
    return response.data?.has_password || false;
  } catch (error) {
    console.error('❌ [checkPhoneExists] Error:', error);
    return false;
  }
}

// ─── تایپ‌ها ────────────────
export interface OrderItem {
  id: number;
  order_number: string | number;
  status: string;
  total_amount: number;
  receiver_name: string;
  receiver_city: string;
  created_at: string;
}

export interface PreInvoiceItem {
  id: number;
  order_number: string | number;
  status: string;
  total_amount: number;
  receiver_name: string;
  receiver_city: string;
  created_at: string;
}

export interface UserDashboardData {
  id: number;
  full_name: string;
  phone_number: string;
  email: string;
  orders_count: number;
  total_spent: number;
  wallet_balance: number;
  last_login: string;
  avatar?: string;
  orders?: OrderItem[];
  pre_invoices?: PreInvoiceItem[];
  data?: UserDashboardData;
}

// ✅ دریافت اطلاعات داشبورد کاربر
export async function GetUserDashboard(): Promise<UserDashboardData | null> {
  try {
    const response = await fetchWithErrorHandling<UserDashboardData>(
      "/users/dashboard/",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    
    return response;
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 401) {
      console.log("User not authenticated");
      return null;
    }
    
    console.error("GetUserDashboard error:", error);
    return null;
  }
}

// ✅ خروج از حساب
export async function logout() {
  try {
    document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie = "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    showToast("خروج از حساب با موفقیت انجام شد");
    
    setTimeout(() => {
      window.location.reload();
    }, 500);
  } catch (error) {
    console.error("Logout error:", error);
    showToast("خطا در خروج از حساب", { color: "danger" });
  }
}

// ✅ رفرش توکن
export async function refreshToken(refresh_token: string) {
  try {
    const response = await api.post("/users/token/refresh/", {
      refresh: refresh_token,
    });
    return response.data;
  } catch (error) {
    console.error("Refresh token error:", error);
    throw error;
  }
}