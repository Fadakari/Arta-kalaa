export const revalidate = 60;

import LayoutShell from "@/components/Products/LayoutShell";
import { getCachedProductList, getShopCategories } from "@/lib/cached-data";
import { breadcrumbSchema, productsSchema } from "@/components/Schema";
import Script from "next/script";
import { cache } from "react";
import { Metadata } from "next";
import { CategoryNode } from "@/types/categories";

const getProductList = cache(async (params: Record<string, unknown>) => {
  return getCachedProductList(params, 1, false);
});

const getCategories = cache(async () => {
  return getShopCategories();
});

export default async function ProductsPage({ searchParams }: any) {
  const resolvedSearchParams = await searchParams;
  
  const params: any = {};
  if (resolvedSearchParams?.category_id) {
    params.category_id = parseInt(resolvedSearchParams.category_id);
  }
  if (resolvedSearchParams?.sort) {
    params.sort = resolvedSearchParams.sort;
  }
  if (resolvedSearchParams?.search) {
    params.search = resolvedSearchParams.search;
  }
  if (resolvedSearchParams?.min_price) {
    params.min_price = resolvedSearchParams.min_price;
  }
  if (resolvedSearchParams?.max_price) {
    params.max_price = resolvedSearchParams.max_price;
  }
  
  if (resolvedSearchParams?.discounted === "true") {
    const data = await getCachedProductList({}, 1, true);
    const categoryRes = await getCategories();
    const categories = categoryRes?.data || [];

    return (
      <LayoutShell
        categories={categories}
        products={data.results || []}
        pagination={{ count: data.count || 0, page: data.page || 1 }}
        searchParams={resolvedSearchParams}
        href="products/offers"
      />
    );
  }

  const data = await getProductList(params);
  const categoryRes = await getCategories();
  const categories = categoryRes?.data || [];

  const breadcrumbs = [
    { name: "خانه", url: `${process.env.NEXT_PUBLIC_SITE_URL}/` },
    { name: "محصولات", url: `${process.env.NEXT_PUBLIC_SITE_URL}/products` },
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
        pagination={{
          count: data.count || 0,
          page: data.page || 1,
        }}
        searchParams={resolvedSearchParams}
      />
    </>
  );
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<any>;
}): Promise<Metadata> {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const categoryId = resolvedSearchParams?.category_id;

  if (categoryId) {
    const categoryRes = await getShopCategories();
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
    title: "خرید محصولات | آرتا کالا",
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