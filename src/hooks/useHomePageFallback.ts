"use client";

import { useEffect, useRef, useState } from "react";
import ProductType from "@/types/product";
import { hasProductDiscount, markDiscountedProduct } from "@/lib/product-discount";

type HomePageData = {
  discountedProducts: ProductType[];
  featuredProducts: ProductType[];
  latestProducts: ProductType[];
  latestArticles: any[];
};

function pickDiscountedProducts(products: ProductType[], limit = 8) {
  const seen = new Set<string>();

  return products
    .filter((product) => {
      if (!product?.slug || seen.has(product.slug)) return false;
      if (!hasProductDiscount(product)) return false;
      seen.add(product.slug);
      return true;
    })
    .slice(0, limit)
    .map((product) => {
      // تبدیل ProductType به Record<string, unknown>
      const productAsRecord = product as unknown as Record<string, unknown>;
      const discounted = markDiscountedProduct(productAsRecord);
      return discounted as unknown as ProductType;
    });
}

export function useHomePageFallback(serverData: HomePageData): HomePageData & {
  isLoading: boolean;
} {
  const needsDiscounted = serverData.discountedProducts.length === 0;
  const [discountedProducts, setDiscountedProducts] = useState(
    serverData.discountedProducts
  );
  const [isLoading, setIsLoading] = useState(needsDiscounted);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (serverData.discountedProducts.length > 0) {
      setDiscountedProducts(serverData.discountedProducts);
      setIsLoading(false);
      fetchedRef.current = true;
      return;
    }

    if (fetchedRef.current) return;
    fetchedRef.current = true;

    let cancelled = false;

    async function loadDiscounted() {
      try {
        const res = await fetch("/api/home/discounted/", { cache: "no-store" });
        if (!res.ok) throw new Error("failed");

        const payload = await res.json();
        const products = Array.isArray(payload.products) ? payload.products : [];

        if (!cancelled && products.length > 0) {
          setDiscountedProducts(products);
        }
      } catch {
        if (cancelled) return;

        try {
          const res = await fetch("/api/proxy/shop/products/?page=1", {
            cache: "no-store",
          });
          if (!res.ok) return;

          const payload = await res.json();
          const list = Array.isArray(payload.results) ? payload.results : [];
          const picked = pickDiscountedProducts(list);

          if (!cancelled && picked.length > 0) {
            setDiscountedProducts(picked);
          }
        } catch {
          // silently fail — section stays hidden
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadDiscounted();

    return () => {
      cancelled = true;
    };
  }, [serverData.discountedProducts.length]);

  return {
    ...serverData,
    discountedProducts,
    isLoading,
  };
}