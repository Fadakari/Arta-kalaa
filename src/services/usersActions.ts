// src/services/userActions.ts
import { fetchWithErrorHandling, ApiError } from "./api";
import api from "./api";

// ─── تایپ‌ها ──────────────────────────────────────
export interface EditInfoData {
  full_name?: string;
  email?: string;
  phone_number?: string;
  address?: string;
  [key: string]: any;
}

export interface ChangePasswordData {
  old_password?: string;
  new_password: string;
  confirm_password?: string;
}

export interface DiscountResponse {
  code: string;
  amount: number;
  percentage?: number;
  expires_at?: string;
}

// ─── ویرایش اطلاعات کاربر ──────────────────────
export const editInfo = async (data: EditInfoData) => {
  try {
    console.log('📝 [editInfo] Updating user info:', data);
    
    // ✅ مسیر درست از Swagger: PATCH /users/dashboard/
    const response = await api.patch("/users/dashboard/", data);
    
    console.log('✅ [editInfo] Success:', response.data);
    
    return {
      success: true,
      data: response.data,
      message: "اطلاعات با موفقیت بروزرسانی شد",
    };
  } catch (error: any) {
    console.error('❌ [editInfo] Error:', error);
    
    if (error instanceof ApiError) {
      return {
        success: false,
        errors: error.details?.errors || {},
        message: error.message || "خطا در بروزرسانی اطلاعات",
      };
    }
    
    // اگر خطای 400 از سرور باشد
    if (error.response?.status === 400) {
      return {
        success: false,
        errors: error.response?.data?.errors || {},
        message: error.response?.data?.message || "اطلاعات ارسال شده نادرست است",
      };
    }
    
    return {
      success: false,
      errors: {},
      message: "خطا در ارتباط با سرور",
    };
  }
};

// ─── تغییر رمز عبور ──────────────────────────────
export const changePassword = async (data: ChangePasswordData) => {
  try {
    console.log('🔑 [changePassword] Changing password...');
    
    // ✅ مسیر درست از Swagger: POST /users/change-password/
    const payload: any = {
      new_password: data.new_password,
    };

    if (data.old_password) {
      payload.old_password = data.old_password;
    }

    if (data.confirm_password) {
      payload.confirm_new_password = data.confirm_password;
    }

    console.log({
      old_password: data.old_password,
      new_password: data.new_password,
    });

    const response = await api.post("/users/change-password/", payload);
    
    console.log('✅ [changePassword] Success:', response.data);
    
    return {
      success: true,
      data: response.data,
      message: "رمز عبور با موفقیت تغییر کرد",
    };
  } catch (error: any) {
    console.error('❌ [changePassword] Error:', error);

    console.log("STATUS:", error.response?.status);
    console.log("DATA:", error.response?.data);
    
    if (error instanceof ApiError) {
      return {
        success: false,
        errors: error.details?.errors || {},
        message: error.message || "خطا در تغییر رمز عبور",
      };
    }
    
    // خطای 400 - رمز قدیم اشتباه است
    if (error.response?.status === 400) {
      return {
        success: false,
        errors: error.response?.data?.errors || {},
        message: error.response?.data?.message || "رمز عبور فعلی صحیح نیست",
      };
    }

    console.log(error.response?.status);
    console.log(error.response?.data);
    console.log("SERVER ERROR:", error.response?.data);
    
    return {
      success: false,
      errors: {},
      message: "خطا در ارتباط با سرور",
    };
  }
};

// ─── دریافت کد تخفیف ──────────────────────────────
export async function generateDiscount(data: { order_amount: number }) {
  try {
    console.log('🎯 [generateDiscount] Generating discount for amount:', data.order_amount);
    
    // ✅ مسیر درست از Swagger: POST /users/discount/auto/generate/
    const response = await api.post("/users/discount/auto/generate/", {
      order_amount: data.order_amount,
    });
    
    console.log('✅ [generateDiscount] Success:', response.data);
    
    return {
      success: true,
      data: response.data,
      message: response.data?.message || "کد تخفیف با موفقیت تولید شد",
    };
  } catch (error: any) {
    console.error('❌ [generateDiscount] Error:', error);
    
    if (error instanceof ApiError) {
      return {
        success: false,
        errors: error.details?.errors || {},
        message: error.message || "خطا در تولید کد تخفیف",
      };
    }
    
    // خطای 400
    if (error.response?.status === 400) {
      return {
        success: false,
        errors: error.response?.data?.errors || {},
        message: error.response?.data?.message || "مبلغ وارد شده معتبر نیست",
      };
    }
    
    return {
      success: false,
      errors: {},
      message: "خطا در ارتباط با سرور",
    };
  }
}

// ─── اعتبارسنجی کد تخفیف ──────────────────────────
export async function validateDiscount(code: string, order_amount?: number) {
  try {
    console.log('✅ [validateDiscount] Validating discount code:', code);
    
    // ✅ مسیر درست از Swagger: POST /users/discount/validate/
    const response = await api.post("/users/discount/validate/", {
      code,
      order_amount: order_amount || 0,
    });
    
    console.log('✅ [validateDiscount] Success:', response.data);
    
    return {
      success: true,
      data: response.data,
      message: response.data?.message || "کد تخفیف معتبر است",
    };
  } catch (error: any) {
    console.error('❌ [validateDiscount] Error:', error);
    
    if (error instanceof ApiError) {
      return {
        success: false,
        errors: error.details?.errors || {},
        message: error.message || "کد تخفیف نامعتبر است",
      };
    }
    
    // خطای 400 - کد تخفیف نامعتبر
    if (error.response?.status === 400) {
      return {
        success: false,
        errors: error.response?.data?.errors || {},
        message: error.response?.data?.message || "کد تخفیف نامعتبر یا منقضی شده است",
      };
    }
    
    return {
      success: false,
      errors: {},
      message: "خطا در ارتباط با سرور",
    };
  }
}

// ─── دریافت تخفیف‌های کاربر ──────────────────────
export async function getUserDiscounts() {
  try {
    console.log('📋 [getUserDiscounts] Fetching user discounts...');
    
    // اگر مسیری برای دریافت تخفیف‌ها وجود دارد
    // از Swagger چک کنید
    const response = await api.get("/users/discounts/");
    
    console.log('✅ [getUserDiscounts] Success:', response.data);
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error('❌ [getUserDiscounts] Error:', error);
    
    return {
      success: false,
      errors: {},
      message: "خطا در دریافت تخفیف‌ها",
    };
  }
}

// ─── دریافت اطلاعات کاربر ──────────────────────────
export async function getUserInfo() {
  try {
    console.log('👤 [getUserInfo] Fetching user info...');
    
    // ✅ مسیر درست از Swagger: GET /users/dashboard/
    const response = await api.get("/users/dashboard/");
    
    console.log('✅ [getUserInfo] Success:', response.data);
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error('❌ [getUserInfo] Error:', error);
    
    if (error instanceof ApiError && error.statusCode === 401) {
      return {
        success: false,
        errors: {},
        message: "لطفاً وارد حساب کاربری خود شوید",
      };
    }
    
    return {
      success: false,
      errors: {},
      message: "خطا در دریافت اطلاعات کاربر",
    };
  }
}

// ─── آپلود عکس پروفایل ─────────────────────────────
export async function uploadAvatar(file: File) {
  try {
    console.log('🖼️ [uploadAvatar] Uploading avatar...');
    
    const formData = new FormData();
    formData.append('avatar', file);
    
    // اگر مسیر آپلود عکس در Swagger وجود دارد
    const response = await api.post("/users/avatar/", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log('✅ [uploadAvatar] Success:', response.data);
    
    return {
      success: true,
      data: response.data,
      message: "عکس پروفایل با موفقیت آپلود شد",
    };
  } catch (error: any) {
    console.error('❌ [uploadAvatar] Error:', error);
    
    return {
      success: false,
      errors: {},
      message: "خطا در آپلود عکس",
    };
  }
}