import { cache } from "react";
import { unstable_cache } from "next/cache";
import {
  GetProducts,
  GetFeaturedProducts,
  GetLatestProducts,
  GetShopCategoriesTreeList,
  GetHomeDiscountedProducts,
} from "@/services/shopActions";
import { hasProductDiscount, markDiscountedProduct } from "@/lib/product-discount";
import {
  GetBlogCategoriesMenuStructure,
  GetLatestBlogPosts,
} from "@/services/blogActions";
import { homeSliderList, GetUserDashboard } from "@/services/homeActions";

const PUBLIC_REVALIDATE = 300;
const HOME_REVALIDATE = 60;

export const getShopCategories = cache(async () => {
  return unstable_cache(
    () => GetShopCategoriesTreeList(),
    ["shop-categories-tree"],
    { revalidate: PUBLIC_REVALIDATE }
  )();
});

export const getBlogCategories = cache(async () => {
  return unstable_cache(
    () => GetBlogCategoriesMenuStructure(),
    ["blog-categories-menu"],
    { revalidate: PUBLIC_REVALIDATE }
  )();
});

export const getHomeSliders = cache(async () => {
  return unstable_cache(
    () => homeSliderList(),
    ["home-sliders"],
    { revalidate: PUBLIC_REVALIDATE }
  )();
});

function pickDiscountedProducts(
  featured: any[],
  latest: any[],
  limit = 8
) {
  const seen = new Set<string>();
  return [...featured, ...latest]
    .filter((product) => {
      if (!product?.slug || seen.has(product.slug)) return false;
      if (!hasProductDiscount(product)) return false;
      seen.add(product.slug);
      return true;
    })
    .slice(0, limit)
    .map((product) => markDiscountedProduct(product));
}

async function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T) {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

export const getHomePageData = cache(async () => {
  return unstable_cache(
    async () => {
      // ✅ اصلاح خط 72 - اضافه کردن فیلدهای گمشده
      const [discountedResult, featured, latest, articles] = await Promise.all([
        withTimeout(GetHomeDiscountedProducts(8), 28_000, { 
          results: [],
          count: 0,
          next: null,
          previous: null,
          page: 1
        }),
        GetFeaturedProducts(8),
        GetLatestProducts(8),
        GetLatestBlogPosts(6),
      ]);

      const featuredProducts = featured || [];
      const latestProducts = latest.results || [];
      let discountedProducts = discountedResult.results || [];

      if (discountedProducts.length === 0) {
        discountedProducts = pickDiscountedProducts(
          featuredProducts,
          latestProducts
        );
      }

      return {
        discountedProducts,
        featuredProducts,
        latestProducts,
        latestArticles: Array.isArray(articles) ? articles : [],
      };
    },
    ["home-page-data"],
    { revalidate: HOME_REVALIDATE }
  )();
});

export const getCachedUserDashboard = cache(async () => {
  return GetUserDashboard();
});

export const getCachedProductList = cache(
  async (params: Record<string, unknown>, page: number, onlyDiscounted = false) => {
    if (onlyDiscounted) {
      return unstable_cache(
        () => GetProducts(params, page, true),
        ["discounted-products-list", JSON.stringify(params), String(page)],
        { revalidate: 300 }
      )();
    }

    return GetProducts(params, page, false);
  }
);