import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { buildApiUrl } from "@/lib/urls";
import { hasProductDiscount, markDiscountedProduct } from "@/lib/product-discount";

// تعریف نوع Product (بر اساس ساختاری که از API میاد)
interface Product {
  id: number;
  // سایر فیلدهای محصول رو اینجا اضافه کن
  [key: string]: any; // موقتی - بعداً با فیلدهای واقعی جایگزین کن
}

const getCachedDiscounted = unstable_cache(
  async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25_000);

    try {
      const response = await fetch(buildApiUrl("/shop/products/?page=1"), {
        signal: controller.signal,
        next: { revalidate: 120 },
      });

      if (!response.ok) return [];

      const data = await response.json();
      const results = Array.isArray(data.results) ? data.results : [];

      return results
        .filter(hasProductDiscount)
        .slice(0, 8)
        .map((product: Product) => markDiscountedProduct(product));
    } catch {
      return [];
    } finally {
      clearTimeout(timeoutId);
    }
  },
  ["home-discounted-products"],
  { revalidate: 120 }
);

export async function GET() {
  const products = await getCachedDiscounted();
  return NextResponse.json({ products });
}