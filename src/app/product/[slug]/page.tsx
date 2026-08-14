import BreadcrumbsBox from "@/components/Products/BreadcrumbsBox";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  GetComments,
  GetProductBySlug,
  GetShopCategoriesTreeList,
} from "@/services/shopActions";
import { CategoryNode } from "@/types/categories";
import ProductType from "@/types/product";
import TabsBox from "@/components/Products/Product/TabsBox";
import { Metadata } from "next";
import { breadcrumbSchema, productSchema } from "@/components/Schema";
import { imageSchema } from "@/components/Schema/imageSchema";
import Script from "next/script";
import ProductSlider from "@/components/Products/Product/ProductSlider";
import AddToCart from "@/components/Products/AddToCart";
import ProductDescription from "@/components/Products/Product/showMore";
import ProductOptions from "@/components/Products/Product/ProductOptions";
import { ProductProvider } from "@/context/ProductContext";
import ProductPriceBox from "@/components/Products/Product/ProductPriceBox";

function findCategory(
  categories: CategoryNode[],
  targetName: string
): CategoryNode | undefined {
  for (const category of categories) {
    if (category.name === targetName) {
      return category;
    }
    if (category.children) {
      const foundInChildren = findCategory(category.children, targetName);
      if (foundInChildren) {
        return foundInChildren;
      }
    }
  }
  return undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const product = await GetProductBySlug(decodedSlug);

  if (!product) {
    return {
      title: "محصول یافت نشد",
      description: "محصول مورد نظر در فروشگاه یافت نشد.",
    };
  }

  const title = `قیمت و خرید ${product.name}`;
  const description =
    product.short_description ||
    `خرید ${product.name} با بهترین قیمت از دسته ${product.category}${
      product.final_price ? " - تخفیف ویژه!" : ""
    }`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "fa_IR",
      siteName: "آرتا کالا",
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/product/${slug}`,
      images: product.cover_image
        ? [
            {
              url: product.cover_image,
              width: 800,
              height: 600,
              alt: product.name,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.cover_image ? [product.cover_image] : [],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/product/${slug}`,
    },
    other: {
      "og:type": "product",
      "og:availability":
        product.is_available && product.stock > 0 ? "instock" : "outofstock",
      availability:
        product.is_available && product.stock > 0 ? "instock" : "outofstock",
      product_id: product.id,
      product_name: product.name,
      product_price: product.final_price
        ? product.final_price
        : (product.price ?? 0),
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  if (!slug || typeof slug !== "string") return notFound();
  const res = await GetProductBySlug(decodedSlug);
  if (!res) return notFound();

  const data: ProductType = res;
  const result = await GetShopCategoriesTreeList();
  const categories: CategoryNode[] = result?.data || [];

  const categoryFind = findCategory(categories, data.category);
  const comments = await GetComments(data.id);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://artakalaa.com";
  const breadcrumbs = [
    { name: "خانه", url: `${siteUrl}/` },
    { name: "محصولات", url: `${siteUrl}/products` },
    categoryFind
      ? {
          name: categoryFind.name,
          url: `${siteUrl}/products?category_id=${categoryFind.id}`,
        }
      : { name: data.category },
    { name: data.name },
  ];

  const schema = [
    productSchema(data),
    breadcrumbSchema(breadcrumbs),
    imageSchema(data.cover_image, data.name),
  ];
  const images =
    data.images && data.images.length > 0
      ? data.images
          .sort((a, b) => a.order - b.order)
          .map((img) => img.image)
          .filter(Boolean)
      : data.cover_image
        ? [data.cover_image]
        : [];

  return (
    <>
      <Script
        id="product-jsonld"
        type="application/ld+json"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />

      <BreadcrumbsBox
        title={data.name}
        items={[
          { label: "خانه", href: "/" },
          { label: "محصولات", href: "/products" },
          {
            label: data.category,
            href: `/products/?category_id=${categoryFind?.id}`,
          },
          { label: data.name },
        ]}
      />
      <ProductProvider product={data}>
        <div className="container customSm:max-w-[566px]">
          <div className="bg-white shadow-lg shadow-black/10 rounded-[5px] px-5 py-4 w-full mt-7 text-sm ">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="w-full md:w-1/3 h-full flex">
                <ProductSlider images={images} alt={data.name} />
              </div>

              <div className="w-full lg:w-2/3 p-2 flex flex-col items-start space-y-5 px-4">
                <h1 className="text-2xl font-bold">{data.name}</h1>

                <div className="text-sm flex flex-col items-start gap-3">
                  <div>
                    <span>دسته :‌</span>{" "}
                    <Link
                      href={`/products/?category_id=${categoryFind?.id}`}
                      className="text-cyan-400 spoiler-link relative"
                    >
                      {data.category}
                    </Link>
                  </div>
                  <div>
                    <span>مشاهده انواع </span>{" "}
                    <Link
                      href={`/products/?category_id=${categoryFind?.id}`}
                      className="text-cyan-400 spoiler-link relative"
                    >
                      {data.category}
                    </Link>
                  </div>
                </div>
                <ProductOptions product={data} />
                <div>
                  <ProductDescription
                    description={data.description_1}
                    maxHeight={100}
                  />
                </div>
              </div>
              <div className="w-5/12 h-full space-y-3 lg:block hidden">
                <div className="bg-zinc-100 border border-zinc-200 p-5 text-center space-y-4 rounded-md">
                  <ProductPriceBox product={data} />

                  {data.stock <= 5 && data.stock > 0 && (
                    <p
                      className={`text-right font-bold font-dana ${
                        data.stock <= 2 ? "text-danger" : "text-warning"
                      }`}
                    >
                      تنها {data.stock === 1 ? "یک" : data.stock + " عدد"} در
                      انبار باقی مانده
                    </p>
                  )}
                  <AddToCart
                    is_available={data.is_available && data.stock > 0}
                    product={data}
                  />
                </div>

                {data.is_available && data.stock > 0 && (
                  <a href="#" className="text-cyan-400 spoiler-link relative">
                    آیا قیمت مناسب‌تری سراغ دارید؟
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="hidden sm:block lg:hidden bg-zinc-100 border border-zinc-200 p-5 my-5 text-center space-y-4 rounded-md">
            <ProductPriceBox product={data} />
            <AddToCart
              is_available={data.is_available && data.stock > 0}
              product={data}
            />
          </div>

          <div className="fixed bottom-0 z-30 right-0 w-full space-y-3 bg-white shadow-2xl sm:hidden p-2 flex items-center gap-3 border-t border-zinc-200">
            <ProductPriceBox product={data} />
            <AddToCart
              is_available={data.is_available && data.stock > 0}
              product={data}
            />
          </div>
          <div className="bg-white shadow-lg shadow-black/10 rounded-[5px] w-full mt-7 text-sm">
            <TabsBox
              comments={comments}
              productId={data.id}
              description_2={data.description_2}
            />
          </div>
        </div>
      </ProductProvider>
    </>
  );
}
