import { cookies } from "next/headers";
import api from "./api";
import { fixImageUrl } from "@/lib/urls";

async function getAccessToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("access_token")?.value || null;
  } catch {
    return null;
  }
}

function processSliderImages(data: any[]): any[] {
  if (!Array.isArray(data)) return data;
  return data.map((item: any) => ({
    ...item,
    image: fixImageUrl(item.image),
  }));
}

// ─── Home Page Actions ──────────────────────────
export const homeAboutUsList = async () => {
  try {
    const result = await api.get("/home/about-us/");
    return result;
  } catch (error) {
    console.error("homeAboutUsList error:", error);
    return null;
  }
};

export const homeContactInfoList = async () => {
  try {
    const result = await api.get("/home/contact-info/");
    return result;
  } catch (error) {
    console.error("homeContactInfoList error:", error);
    return null;
  }
};

export const homeGalleryList = async () => {
  try {
    const result = await api.get("/home/gallery/");
    return result.data;
  } catch (error) {
    console.error("homeGalleryList error:", error);
    return null;
  }
};

export const homeSliderList = async () => {
  try {
    const result = await api.get("/home/sliders/");
    const data = result.data;
    return processSliderImages(data);
  } catch (error) {
    console.error("homeSliderList error:", error);
    return [];
  }
};

// ─── Dashboard & Orders ─────────────────────────
export const GetUserDashboard = async () => {
  const token = await getAccessToken();
  if (!token) return null;

  try {
    const result = await api.get("/users/dashboard/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return result.data;
  } catch (error: any) {
    console.error("GetUserDashboard error:", error?.response?.data || error?.message);
    return null;
  }
};

export async function GetDiscountedOrders() {
  "use server";
  
  const token = await getAccessToken();
  if (!token) return null;

  try {
    const response = await api.get("/home/discounted-orders/", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

    return response.data;
  } catch (error) {
    console.error("GetDiscountedOrders error:", error);
    return null;
  }
}

export async function getUserOrders() {
  "use server";
  
  const token = await getAccessToken();
  if (!token) return null;

  try {
    const response = await api.get("/users/orders", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("getUserOrders error:", error);
    return null;
  }
}

export async function GetDiscountedOrder(orderNumber: string) {
  "use server";
  
  const token = await getAccessToken();
  if (!token) return null;

  try {
    const response = await api.get(`/home/discounted-orders/${orderNumber}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("GetDiscountedOrder error:", error);
    return null;
  }
}