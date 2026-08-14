export const revalidate = 60;

import LayoutShell from "@/components/Products/LayoutShell";
import { getCachedProductList, getShopCategories } from "@/lib/cached-data";
import { Metadata } from "next";
import { cache } from "react";

const getProductList = cache(
  async (filters: Record<string, unknown>, page: number, onlyDiscounted: boolean) => {
    return getCachedProductList(filters, page, onlyDiscounted);
  }
);

const getCategories = cache(async () => {
  return getShopCategories();
});
export default async function ProductsPage({ searchParams }: any) {
  const search = await searchParams;
  const data = await getProductList({}, 1, true);

  const categoryRes = await getCategories();
  const categories = categoryRes?.data || [];
  return (
    <LayoutShell
      categories={categories}
      products={data.results || []}
      pagination={{ count: data.count, page: data?.page || 1 }}
      searchParams={search}
      href="products/offers"
    />
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const title = "تخفیف‌های شگفت‌انگیز | فروشگاه آرتا کالا";
  const description =
    "جدیدترین پیشنهادهای ویژه و تخفیف‌های شگفت‌انگیز فروشگاه آرتا کالا! خرید محصولات منتخب با قیمت باورنکردنی و ارسال سریع.";
  const keywords = [
    "تخفیف ویژه",
    "پیشنهاد شگفت‌انگیز",
    "حراج",
    "فروش ویژه",
    "قیمت باورنکردنی",
    "فروشگاه آرتا کالا",
    "خرید آنلاین ارزان",
  ];

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/amazing-offers`,
      siteName: "آرتا کالا",
      locale: "fa_IR",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

