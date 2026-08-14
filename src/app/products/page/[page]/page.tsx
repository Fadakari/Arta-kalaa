export const revalidate = 30;

import LayoutShell from "@/components/Products/LayoutShell";
import { breadcrumbSchema, productsSchema } from "@/components/Schema";
import { GetProducts, GetShopCategoriesTreeList } from "@/services/shopActions";
import { CategoryNode } from "@/types/categories";
import { Metadata } from "next";
import Script from "next/script";
import { cache } from "react";

const getProductList = cache(async (filters: any, page: any) => {
  return await GetProducts(filters, page);
});

const getCategories = cache(async () => {
  return await GetShopCategoriesTreeList();
});

export default async function ProductsPage({ params, searchParams }: any) {
  const { page } = await params;
  const search = await searchParams;
  const currentPage = Number(page) || 1;  // ✅ اصلاح شده
  const filters = { ...search, page: currentPage };
  const data = await getProductList(filters, page);
  const categoryRes = await getCategories();
  const categories = categoryRes?.data || [];
  const breadcrumbs = [
    { name: "خانه", url: "/" },
    { name: "محصولات", url: "/products" },
  ];
  const schema = [
    ...productsSchema(data.results || []),
    breadcrumbSchema(breadcrumbs),
  ];
  return (
    <>
      <Script
        id="products-jsonld"
        type="application/ld+json"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <LayoutShell
        categories={categories}
        products={data.results || []}
        pagination={{ count: data?.count || 0, page: currentPage }}
        searchParams={search}
      />
    </>
  );
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<any>;
}): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;  // ✅ اصلاح شده
  const categoryId = resolvedSearchParams?.category_id;

  if (categoryId) {
    const categoryRes = await GetShopCategoriesTreeList();
    const categories = categoryRes?.data || [];
    const category = categories.find(
      (cat: CategoryNode) => cat.id === +categoryId
    );

    const categoryTitle = category?.name || "دسته‌بندی انتخاب‌شده";

    const title = `${categoryTitle} | خرید انواع ${categoryTitle} با بهترین قیمت | آرتا کالا`;
    const description = `خرید اینترنتی ${categoryTitle} از فروشگاه آرتا کالا با بهترین قیمت و ارسال سریع. بررسی و فیلتر محصولات ${categoryTitle}.`;

    return {
      title,
      description,
      keywords: [
        categoryTitle,
        "فروشگاه آرتا کالا",
        "خرید آنلاین",
        "قیمت مناسب",
      ],
      openGraph: {
        title,
        description,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/products?category_id=${categoryId}`,
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

  return {
    title: "خرید محصولات | فروشگاه آرتا کالا",
    description:
      "مشاهده و خرید جدیدترین محصولات با بهترین قیمت از فروشگاه آرتا کالا. فیلتر بر اساس قیمت، موجودی، ویژگی و ...",
    keywords: ["فروشگاه آرتا کالا", "خرید آنلاین", "محصولات", "قیمت مناسب"],
    openGraph: {
      title: "خرید محصولات | فروشگاه آرتا کالا",
      description:
        "فروشگاه آرتا کالا ارائه‌دهنده انواع محصولات با بهترین قیمت و تضمین کیفیت. خرید آنلاین آسان و سریع.",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/products`,
      siteName: "آرتا کالا",
      locale: "fa_IR",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: "خرید محصولات | آرتا کالا",
      description:
        "محصولات متنوع با قیمت مناسب از فروشگاه اینترنتی آرتا کالا. خرید سریع، امن و مطمئن.",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}