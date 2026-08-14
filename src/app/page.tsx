// app/page.tsx
export const revalidate = 60;

import { Metadata } from "next";
import Brand from "@/components/Brand";
import Slider from "@/components/Slider";
import HomeSlider from "@/components/HomeSlider";
import FeatureCard from "@/components/home/FeatureCard";
import CategoryCard from "@/components/home/CategoryCard";
import SectionHeader from "@/components/home/SectionHeader";
import {
  getBlogCategories,
  getHomePageData,
  getHomeSliders,
  getShopCategories,
} from "@/lib/cached-data";
import HomePageClient from "./HomePageClient";
import { FEATURES, BRANDS, METADATA_CONFIG } from "@/constants/home";
import { ImageType, SliderImage } from "@/types";

async function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T) {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

export const metadata: Metadata = {
  title: METADATA_CONFIG.title,
  description: METADATA_CONFIG.description,
  keywords: METADATA_CONFIG.keywords,
  openGraph: {
    title: "آرتا کالا",
    description: "خرید آنلاین با تضمین کیفیت و ارسال سریع از آرتا کالا",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
    siteName: "آرتا کالا",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/opengraph-image.jpg`,
        width: 1200,
        height: 630,
        alt: "آرتا کالا",
      },
    ],
    locale: "fa_IR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "آرتا کالا",
    description: "خرید آنلاین با تضمین کیفیت و ارسال سریع از آرتا کالا",
    images: [`${process.env.NEXT_PUBLIC_SITE_URL}/opengraph-image.jpg`],
  },
};

export default async function Home() {
  const [shopCategoriesResult, blogCategoriesResult, slidersResult, homeData] =
    await Promise.all([
      getShopCategories(),
      withTimeout(getBlogCategories(), 8_000, []),
      withTimeout(getHomeSliders(), 8_000, []),
      getHomePageData(),
    ]);

  const shopCategories = shopCategoriesResult?.data || [];
  const blogCategoriesRaw = blogCategoriesResult || [];
  const slidersRaw = slidersResult || [];

  const sliderImages: SliderImage[] = Array.isArray(slidersRaw)
    ? slidersRaw
        .sort((a: ImageType, b: ImageType) => (a.order || 0) - (b.order || 0))
        .map((item: ImageType) => ({
          id: item.id,
          src: item.image,
          alt: `بنر تبلیغاتی شماره ${item.order || ""}`,
        }))
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {sliderImages.length > 0 && (
        <header className="relative max-w-[1470px] py-6 mx-auto px-4">
          <div className="w-full overflow-hidden rounded-3xl shadow-2xl ring-1 ring-black/5">
            <HomeSlider images={sliderImages} />
          </div>
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl -z-10" />
          <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-blue-500/5 rounded-full blur-3xl -z-10" />
        </header>
      )}

      <h1 className="sr-only">
        آرتا کالا | فروشگاه آنلاین ابزار با تضمین کیفیت
      </h1>

      {/* کلاینت کامپوننت */}
        <HomePageClient
          discountedProducts={homeData.discountedProducts}
          blogCategories={blogCategoriesRaw.slice(0, 4)}
          featuredProducts={homeData.featuredProducts}
          latestProducts={homeData.latestProducts}
          latestArticles={homeData.latestArticles}
        />

        {/* دسته‌بندی محصولات */}
        {shopCategories.length > 0 && (
          <section className="relative max-w-[1470px] mx-auto px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-lg border border-gray-100">
              <SectionHeader title="محصولات" highlight="دسته بندی" />
              <nav
                aria-label="دسته‌بندی‌های سریع"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 place-items-center py-4"
              >
                {shopCategories.slice(0, 6).map((cat: any) => (
                  <CategoryCard key={cat.id} category={cat} />
                ))}
              </nav>
            </div>
          </section>
        )}

      <main className="space-y-8 pb-20">
        {/* برندها - با اسکرول خودکار هر ۵ ثانیه */}
        <section className="relative max-w-[1470px] mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-blue-50/60 p-8 shadow-lg border border-blue-100">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-200/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-200/30 rounded-full blur-3xl" />
            
            <div className="relative text-center mb-8">
              <span className="inline-block px-4 py-1.5 bg-blue-100/80 rounded-full text-xs font-medium text-blue-600 mb-3">
                برندهای برتر
              </span>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-800">
                معتبرترین <span className="text-blue-500">برندها</span> در آرتاکالا
              </h3>
            </div>

            <div className="relative px-2">
              <Slider
                spaceBetween={30}
                items={BRANDS}
                Card={Brand}
                navigation={true}
                autoplay={true}
                autoplayDelay={5000}
                slidesPerView={5}
                breakpoints={{
                  320: { slidesPerView: 2 },
                  640: { slidesPerView: 3 },
                  768: { slidesPerView: 4 },
                  1024: { slidesPerView: 5 },
                }}
              />
            </div>

            <div className="relative text-center mt-6">
              <p className="text-blue-400 text-sm">
                و ده‌ها برند معتبر دیگر...
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ویژگی‌ها */}
        <section className="max-w-[1470px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="inline-block">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-12 h-0.5 bg-blue-500 rounded-full" />
                <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
                  مزایای ما
                </span>
                <div className="w-12 h-0.5 bg-blue-500 rounded-full" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-3">
                چرا <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500">آرتا کالا</span>؟
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                انتخابی هوشمندانه برای خریدی امن و مطمئن
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </section>
    </div>
  );
}