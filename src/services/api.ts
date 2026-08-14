// src/services/api.ts
import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import https from "https";
import { getApiBaseUrl } from "@/lib/urls";

export interface ApiRequestConfig extends InternalAxiosRequestConfig {
  __retryCount?: number;
  skipRetry?: boolean;
}

const CLIENT_TIMEOUT = 12000;
const SERVER_TIMEOUT = 30000;
const SEARCH_TIMEOUT = 10000;

// ✅ ایجاد نمونه Axios با تنظیمات درست
const api: AxiosInstance = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: typeof window === "undefined" ? SERVER_TIMEOUT : CLIENT_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  withCredentials: true,
  ...(typeof window === 'undefined' && {
    httpsAgent: new https.Agent({
      rejectUnauthorized: process.env.NODE_ENV === 'production',
    }),
  }),
});

const SEARCH_URL_PATTERNS = ["/search", "search="];

function isSearchRequest(url?: string) {
  if (!url) return false;
  return SEARCH_URL_PATTERNS.some((pattern) => url.includes(pattern));
}

// ─── Interceptor درخواست ───
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const requestConfig = config as ApiRequestConfig;

    if (isSearchRequest(requestConfig.url)) {
      requestConfig.timeout = SEARCH_TIMEOUT;
      requestConfig.skipRetry = true;
    }

    if (process.env.NODE_ENV === "development") {
      console.log(
        `[API Request] ${requestConfig.method?.toUpperCase()} ${requestConfig.baseURL}${requestConfig.url}`
      );
    }

    // جلوگیری از کش در کلاینت
    if (requestConfig.method === "get" && typeof window !== "undefined") {
      requestConfig.params = {
        ...requestConfig.params,
        _t: Date.now(),
      };
    }

    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");

      if (token) {
        requestConfig.headers.Authorization = `Bearer ${token}`;
      }
    }

    return requestConfig;
  },
  (error: AxiosError) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  }
);

// ─── Interceptor پاسخ ───
api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[API Response] ${response.config.url} - Status: ${response.status}`);
    }
    return response;
  },
  async (error: AxiosError) => {
    const config = error.config as ApiRequestConfig | undefined;
    if (!config) return Promise.reject(error);

    // Retry logic
    const noRetryUrls = ["/users/login/password/", "/users/otp/verify/"];
    const shouldNotRetry =
      config.skipRetry ||
      noRetryUrls.some((url) => config.url?.includes(url)) ||
      isSearchRequest(config.url);

    if (shouldNotRetry) {
      return Promise.reject(error);
    }

    config.__retryCount = config.__retryCount || 0;
    const maxRetries = typeof window === "undefined" ? 1 : 1;

    if (
      (!error.response || error.code === "ECONNABORTED") &&
      config.__retryCount < maxRetries
    ) {
      config.__retryCount++;

      if (process.env.NODE_ENV === "development") {
        console.log(`[API Retry ${config.__retryCount}] ${config.url}`);
      }

      const delay = 1000 * config.__retryCount;
      await new Promise((resolve) => setTimeout(resolve, delay));

      return api(config);
    }

    if (process.env.NODE_ENV === "development") {
      if (error.code === "ECONNABORTED") {
        console.warn(`[API Timeout] ${config.url}`);
      } else if (error.response?.status === 404) {
        console.warn(`[API 404] ${config.url}`);
      } else if (error.response?.status === 500) {
        console.error(`[API 500] ${config.url}`);
      } else {
        console.warn(`[API Error] ${config.url} - ${error.message}`);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// ─── کلاس خطای سفارشی ───
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ─── تابع fetch با مدیریت خطا ───
export async function fetchWithErrorHandling<T = any>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const baseUrl = getApiBaseUrl();
    const fullUrl = `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`;
    
    if (process.env.NODE_ENV === "development") {
      console.log(`[fetchWithErrorHandling] Requesting: ${fullUrl}`);
    }

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    
    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        "Content-Type":"application/json",
        "Accept":"application/json",
        ...(token && {
          Authorization: `Bearer ${token}`,
        }),
        ...options?.headers,
      },
      credentials: 'include',
      cache: 'no-store',
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
      }
      
      console.error(`[fetchWithErrorHandling] Error ${response.status}:`, errorData);
      
      throw new ApiError(
        errorData?.error || errorData?.message || "خطا در ارتباط با سرور",
        response.status,
        errorData?.errors || errorData
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    
    if (error instanceof TypeError && error.message?.includes('fetch')) {
      throw new ApiError(
        "مشکل در ارتباط با سرور. لطفاً اتصال اینترنت خود را بررسی کنید.",
        0
      );
    }
    
    throw new ApiError("خطا در ارتباط با سرور", 500);
  }
}