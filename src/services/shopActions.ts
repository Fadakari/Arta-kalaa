import api from "./api";
import { fixImageUrl } from "@/lib/urls";
import {
  getProductPrice,
  getProductFinalPrice,
  hasProductDiscount,
  markDiscountedProduct as markProductDiscount,
} from "@/lib/product-discount";
import type { AxiosResponse } from "axios";

export { hasProductDiscount } from "@/lib/product-discount";

type ProductListPageData = {
  results?: any[];
  count?: number;
  next?: string | null;
  previous?: string | null;
};

type ProductListResponse = AxiosResponse<ProductListPageData>;

const DISCOUNTED_CACHE_TTL = 60_000;
const DISCOUNTED_PAGE_SIZE = 20;
const HOME_DISCOUNTED_TIMEOUT = 25_000;
const HOME_DISCOUNTED_CACHE_TTL = 60_000;

let discountedProductsCache: { data: any[]; ts: number } | null = null;
let homeDiscountedCache: {
  data: {
    results: any[];
    count: number;
    next: null;
    previous: null;
    page: number;
  };
  ts: number;
} | null = null;

// ─── Helper ──────────────────────────────────────
function markDiscountedProduct(product: any) {
  return markProductDiscount(product);
}

function parseDiscountedList(data: any): any[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.results)) return data.results;
  return [];
}

function fixProductImages(products: any[]): any[] {
  if (!Array.isArray(products)) return products;
  return products.map((product: any) => ({
    ...product,
    cover_image: fixImageUrl(product.cover_image),
    image: fixImageUrl(product.image),
    gallery: product.gallery?.map((img: string) => fixImageUrl(img)),
  }));
}

function mergeProductsWithDiscounts(
  products: any[],
  discountedProducts: any[]
): any[] {
  const discountMap = new Map(
    (discountedProducts || []).map((item: any) => [item.slug, item])
  );

  const merged = products.map((product: any) => {
    const discount = discountMap.get(product.slug);

    if (discount) {
      return markDiscountedProduct({
        ...product,
        discount_percentage: discount.discount_percentage,
        final_price: discount.final_price ?? product.final_price,
      });
    }

    if (hasProductDiscount(product)) {
      return markDiscountedProduct(product);
    }

    return { ...product, isDiscounted: false };
  });

  return fixProductImages(merged);
}

function applyProductFilters(products: any[], params?: any): any[] {
  if (!params) return products;

  let filtered = [...products];

  if (params.category_id) {
    const categoryId = String(params.category_id);
    filtered = filtered.filter(
      (product) =>
        String(product.category_id ?? product.category?.id ?? "") === categoryId
    );
  }

  if (params.search) {
    const term = String(params.search).trim().toLowerCase();
    filtered = filtered.filter((product) =>
      String(product.name || "")
        .toLowerCase()
        .includes(term)
    );
  }

  if (params.min_price) {
    const minPrice = Number(params.min_price);
    filtered = filtered.filter(
      (product) => getProductFinalPrice(product) ?? getProductPrice(product) >= minPrice
    );
  }

  if (params.max_price) {
    const maxPrice = Number(params.max_price);
    filtered = filtered.filter(
      (product) => getProductFinalPrice(product) ?? getProductPrice(product) <= maxPrice
    );
  }

  if (params.sort === "price_asc") {
    filtered.sort(
      (a, b) =>
        (getProductFinalPrice(a) ?? getProductPrice(a)) -
        (getProductFinalPrice(b) ?? getProductPrice(b))
    );
  } else if (params.sort === "price_desc") {
    filtered.sort(
      (a, b) =>
        (getProductFinalPrice(b) ?? getProductPrice(b)) -
        (getProductFinalPrice(a) ?? getProductPrice(a))
    );
  }

  return filtered;
}

const PRODUCT_PAGE_CONCURRENCY = 2;
const HOME_DISCOUNTED_SCAN_LIMIT = 5;

async function fetchProductPages(
  totalPages: number,
  firstResponse?: ProductListResponse
): Promise<ProductListResponse[]> {
  const responses: ProductListResponse[] = [];

  if (firstResponse) {
    responses.push(firstResponse);
  }

  const startPage = firstResponse ? 2 : 1;

  for (let page = startPage; page <= totalPages; page += PRODUCT_PAGE_CONCURRENCY) {
    const pages = Array.from(
      { length: Math.min(PRODUCT_PAGE_CONCURRENCY, totalPages - page + 1) },
      (_, index) => page + index
    );

    const batchResponses = await Promise.all(
      pages.map((currentPage) =>
        api.get<ProductListPageData>(`/shop/products?page=${currentPage}`)
      )
    );
    responses.push(...batchResponses);
  }

  return responses;
}

function collectDiscountedFromResponses(
  responses: ProductListResponse[]
): any[] {
  return responses.flatMap((response) =>
    (response.data?.results || []).filter(hasProductDiscount)
  );
}

async function fetchAllDiscountedProducts(): Promise<any[]> {
  if (
    discountedProductsCache &&
    Date.now() - discountedProductsCache.ts < DISCOUNTED_CACHE_TTL
  ) {
    return discountedProductsCache.data;
  }

  const firstResponse = await api.get<ProductListPageData>("/shop/products?page=1");
  const firstResults = firstResponse.data?.results || [];
  const pageSize = firstResults.length || 20;
  const totalCount = firstResponse.data?.count || firstResults.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const pageResponses = await fetchProductPages(totalPages, firstResponse);
  const collected = collectDiscountedFromResponses(pageResponses);

  const normalized = fixProductImages(
    collected.map((product) => markDiscountedProduct(product))
  );

  discountedProductsCache = { data: normalized, ts: Date.now() };
  return normalized;
}

function emptyHomeDiscountedResponse() {
  return {
    results: [] as any[],
    count: 0,
    next: null,
    previous: null,
    page: 1,
  };
}

export async function GetHomeDiscountedProducts(limit = 8) {
  if (
    homeDiscountedCache &&
    Date.now() - homeDiscountedCache.ts < HOME_DISCOUNTED_CACHE_TTL
  ) {
    return homeDiscountedCache.data;
  }

  const requestConfig = {
    skipRetry: true,
    timeout: HOME_DISCOUNTED_TIMEOUT,
  } as any;

  try {
    const [page1, page2] = await Promise.allSettled([
      api.get<ProductListPageData>("/shop/products?page=1", requestConfig),
      api.get<ProductListPageData>("/shop/products?page=2", requestConfig),
    ]);

    const responses: ProductListResponse[] = [];
    if (page1.status === "fulfilled") responses.push(page1.value);
    if (page2.status === "fulfilled") responses.push(page2.value);

    if (responses.length === 0) {
      throw new Error("discounted products fetch failed");
    }

    const seen = new Set<string>();
    const collected = collectDiscountedFromResponses(responses).filter(
      (product) => {
        if (!product?.slug || seen.has(product.slug)) return false;
        seen.add(product.slug);
        return true;
      }
    );

    const results = fixProductImages(
      collected.slice(0, limit).map((product) => markDiscountedProduct(product))
    );

    const payload = {
      results,
      count: results.length,
      next: null,
      previous: null,
      page: 1,
    };

    homeDiscountedCache = { data: payload, ts: Date.now() };
    return payload;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.warn("[GetHomeDiscountedProducts]", message);
    }
    return emptyHomeDiscountedResponse();
  }
}

async function getDiscountedProductsPage(params?: any, page = 1) {
  const allDiscounted = await fetchAllDiscountedProducts();
  const filtered = applyProductFilters(allDiscounted, params);
  const start = (page - 1) * DISCOUNTED_PAGE_SIZE;
  const results = filtered.slice(start, start + DISCOUNTED_PAGE_SIZE);

  return {
    results,
    count: filtered.length,
    next: start + DISCOUNTED_PAGE_SIZE < filtered.length ? page + 1 : null,
    previous: page > 1 ? page - 1 : null,
    page,
  };
}

function buildQueryString(params?: any, page?: number): string {
  const query = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.append(key, String(value));
      }
    });
  }

  if (page) query.append("page", String(page));
  return query.toString();
}

export async function GetProducts(
  params?: any,
  page?: number,
  onlyDiscounted?: boolean
) {
  try {
    const queryString = buildQueryString(params, page);

    if (onlyDiscounted) {
      return await getDiscountedProductsPage(params, page || 1);
    }

    const resNormal = await api.get(`/shop/products?${queryString}`);
    const normalData = resNormal.data;

    return {
      count: normalData?.count || 0,
      next: normalData?.next || null,
      previous: normalData?.previous || null,
      results: mergeProductsWithDiscounts(normalData?.results || [], []),
      page: page || 1,
    };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      const message = error instanceof Error ? error.message : "request failed";
      console.warn("GetProducts:", message);
    }
    return {
      count: 0,
      next: null,
      previous: null,
      results: [],
      page: page || 1,
    };
  }
}

// ✅ اصلاح شده: دریافت آخرین محصولات
export async function GetLatestProducts(limit: number = 8) {
  try {
    const resLatest = await api.get(`/shop/latest-products/?limit=${limit}`);

    let latestProducts = [];
    const latestData = resLatest.data;

    if (Array.isArray(latestData)) {
      latestProducts = latestData;
    } else if (latestData?.results && Array.isArray(latestData.results)) {
      latestProducts = latestData.results;
    } else if (latestData?.data && Array.isArray(latestData.data)) {
      latestProducts = latestData.data;
    } else if (
      latestData?.latest_products &&
      Array.isArray(latestData.latest_products)
    ) {
      latestProducts = latestData.latest_products;
    } else if (latestData?.products && Array.isArray(latestData.products)) {
      latestProducts = latestData.products;
    }

    return {
      results: mergeProductsWithDiscounts(latestProducts, []),
      page: 1,
    };
  } catch (error) {
    console.error("GetLatestProducts error:", error);
    return { results: [], page: 1 };
  }
}

// ✅ اصلاح شده: دریافت محصولات پرفروش
export async function GetFeaturedProducts(limit: number = 8) {
  try {
    const result = await api.get(`/shop/featured-products/?limit=${limit}`);
    const data = result.data;
    
    // استخراج محصولات از ساختارهای مختلف پاسخ
    let products = [];
    if (Array.isArray(data)) {
      products = data;
    } else if (data?.results && Array.isArray(data.results)) {
      products = data.results;
    } else if (data?.data && Array.isArray(data.data)) {
      products = data.data;
    } else if (data?.featured_products && Array.isArray(data.featured_products)) {
      products = data.featured_products;
    } else if (data?.products && Array.isArray(data.products)) {
      products = data.products;
    } else {
      products = [];
    }
    
    return mergeProductsWithDiscounts(products, []);
  } catch (error) {
    console.error("GetFeaturedProducts error:", error);
    return [];
  }
}

// ✅ اصلاح شده: دریافت دسته‌بندی‌ها
export async function GetShopCategoriesTreeList() {
  try {
    const result = await api.get("/shop/categories/tree/");
    const data = result.data;
    
    // استخراج دسته‌بندی‌ها از ساختارهای مختلف
    if (Array.isArray(data)) {
      return { data: data };
    }
    
    if (data?.data && Array.isArray(data.data)) {
      return { data: data.data };
    }
    
    if (data?.results && Array.isArray(data.results)) {
      return { data: data.results };
    }
    
    if (data?.categories && Array.isArray(data.categories)) {
      return { data: data.categories };
    }
    
    return { data: [] };
  } catch (error) {
    console.error("GetShopCategoriesTreeList error:", error);
    return { data: [] };
  }
}

export async function GetProductBySlug(slug: string) {
  try {
    const productRes = await api.get(`/shop/products/${slug}/`);
    let product = productRes.data;

    try {
      const discountRes = await api.get(
        `/home/discounted-products/${slug}/`
      );
      product = {
        ...product,
        isDiscounted: true,
        final_price: discountRes.data.final_price,
        discount_percentage: discountRes.data.discount_percentage,
      };
    } catch {
      product = { ...product, isDiscounted: false };
    }
    
    return {
      ...product,
      cover_image: fixImageUrl(product.cover_image),
      image: fixImageUrl(product.image),
      gallery: product.gallery?.map((img: string) => fixImageUrl(img))
    };
  } catch (error) {
    console.error("GetProductBySlug error:", error);
    return null;
  }
}

// ─── Cart ──────────────────────────
export async function GetShopCartList() {
  try {
    const res = await fetch("/internal-api/shop/cart", {
      method: "GET",
      cache: "no-store",
    });
    if (!res.ok) throw new Error("خطا در دریافت سبد خرید");
    const data = await res.json();
    
    if (data?.items && Array.isArray(data.items)) {
      data.items = data.items.map((item: any) => ({
        ...item,
        product: item.product ? {
          ...item.product,
          cover_image: fixImageUrl(item.product.cover_image),
          image: fixImageUrl(item.product.image)
        } : item.product
      }));
    }
    
    return data;
  } catch (error) {
    console.error("GetShopCartList error:", error);
    return null;
  }
}

export async function PostShopCart(item: {
  product_id: number;
  quantity: number;
  is_discounted?: boolean;
  store_name_english?: string;
  color_id?: number | null;
  material_id?: number | null;
}) {
  try {
    const res = await fetch("/internal-api/shop/cart/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error || "خطا در افزودن به سبد خرید" };
    return data;
  } catch (error: any) {
    return { error: error.message || "خطا در ارتباط با سرور" };
  }
}

export async function PatchShopCart(
  id: number,
  data: { quantity: number; is_discounted?: boolean }
) {
  const url = data?.is_discounted
    ? "/internal-api/shop/discounted-cart/"
    : "/internal-api/shop/cart/";
  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...data }),
    });
    const result = await res.json();
    if (!res.ok) return { error: result?.error || "خطا در بروزرسانی" };
    return result;
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function DeleteShopCart(id: string, is_discounted?: boolean) {
  const url = is_discounted ? "/internal-api/shop/discounted-cart" : "/internal-api/shop/cart";
  try {
    const res = await fetch(`${url}?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete");
    return await res.json();
  } catch (error) {
    console.error("DeleteShopCart error:", error);
    return null;
  }
}

export async function ClearShopCart() {
  try {
    const res = await fetch("/internal-api/shop/cart/clear", { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to clear");
    return await res.json();
  } catch (error) {
    console.error("ClearShopCart error:", error);
    return null;
  }
}

// ─── Orders ────────────────────────
export async function createDiscountedOrder(data: any) {
  try {
    const res = await fetch("/internal-api/shop/order/discounted", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    return {
      success: res.ok,
      data: json,
      message: json.message || (res.ok ? "سفارش ثبت شد" : "خطا"),
    };
  } catch (error: any) {
    return { success: false, message: error.message || "خطای ناشناخته" };
  }
}

export async function createNormalOrder(data: any) {
  try {
    const res = await fetch("/internal-api/shop/order/normal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    return {
      success: res.ok,
      data: json,
      message: json.message || (res.ok ? "سفارش ثبت شد" : "خطا"),
    };
  } catch (error: any) {
    return { success: false, message: error.message || "خطای ناشناخته" };
  }
}

export async function marketing_create_order(data: any, store_name_english: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/internal-api/marketing/store/${store_name_english}/order/create`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );
    const json = await res.json();
    return {
      success: res.ok,
      data: json,
      message: json.message || (res.ok ? "سفارش ثبت شد" : "خطا"),
    };
  } catch (error: any) {
    return { success: false, message: error.message || "خطای ناشناخته" };
  }
}

export async function goToGateways(id: number | string) {
  try {
    const res = await fetch(`/internal-api/shop/pay/${id}`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) throw new Error("خطا در اتصال به درگاه");
    const result = await res.json();
    if (result.tc) localStorage.setItem("tc", result.tc);
    if (result.gateway_url) {
      const { url, params, method } = result.gateway_url;
      if (method === "GET") {
        window.location.href = `${url}?${new URLSearchParams(params)}`;
      } else {
        const form = document.createElement("form");
        form.method = method;
        form.action = url;
        form.style.display = "none";
        Object.entries(params).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
      }
    }
  } catch (err) {
    console.error("Payment error:", err);
    alert("خطا در اتصال به درگاه پرداخت");
  }
}

export async function GetShippingServices() {
  try {
    const result = await api.get("/shop/shipping-services");
    return result;
  } catch (error) {
    console.error("GetShippingServices error:", error);
    return null;
  }
}

export async function GetComments(product_id: number) {
  try {
    const response = await api.get(`/shop/products/${product_id}/comments/`);
    return response.data;
  } catch (error) {
    console.error("GetComments error:", error);
    return [];
  }
}

export async function PostComment(
  product_id: number,
  data: { text: string; parent?: number | null }
) {
  const res = await fetch(`/internal-api/shop/comments/${product_id}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.message || "ارسال نظر با خطا مواجه شد");
  }
  return res.json();
}

export async function DeleteComment(commentId: number) {
  const res = await fetch(`/internal-api/shop/comments/delete/${commentId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "خطا در حذف نظر");
  }
  return true;
}