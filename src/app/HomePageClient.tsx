// HomePageClient.tsx
"use client";

import Card from "@/components/Products/Card";
import QuickBlogCard from "@/components/QuickBlogCard";
import Slider from "@/components/Slider";
import Link from "next/link";
import { BlogCategory } from "@/types";
import ProductType from "@/types/product";

// ========== SectionHeader ==========
interface SectionHeaderProps {
  title: string;
  highlight?: string;
  linkHref?: string;
  linkText?: string;
  badge?: string;
}

function SectionHeader({ title, highlight, linkHref, linkText = "مشاهده همه", badge }: SectionHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div>
            {badge && (
              <span className="inline-block text-xs font-semibold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full mb-2">
                {badge}
              </span>
            )}
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              {highlight && <span className="text-blue-600">{highlight}</span>}
              {title}
            </h2>
          </div>
        </div>
        {linkHref && (
          <Link 
            href={linkHref} 
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 font-medium transition-colors duration-200"
          >
            <span>{linkText}</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        )}
      </div>
      <div className="mt-2 flex gap-2">
        <div className="h-0.5 w-12 bg-blue-500 rounded-full" />
        <div className="h-0.5 w-3 bg-blue-200 rounded-full" />
      </div>
    </div>
  );
}

// ========== Banner تبلیغاتی ==========
function PromoBanner() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600 p-5 md:p-7">
      <div className="absolute inset-0 bg-black/5" />
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
      
      <div className="relative flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-right">
          <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
            <svg className="w-5 h-5 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
            <span className="text-yellow-200 text-xs font-semibold">تخفیف ویژه</span>
          </div>
          <h3 className="text-white text-lg md:text-xl font-bold mb-1">
            تا ۵۰٪ تخفیف برای محصولات منتخب
          </h3>
          <p className="text-white/80 text-xs">
            با کد تخفیف <span className="bg-white/20 px-2 py-0.5 rounded-md font-mono text-xs">WINTER50</span> از تخفیف ویژه بهره‌مند شوید
          </p>
        </div>
        <Link
          href="/products/offers"
          className="bg-white text-purple-700 px-5 py-2 rounded-lg font-semibold hover:shadow-md transition-all duration-200 hover:scale-105 text-sm"
        >
          خرید کنید
        </Link>
      </div>
    </div>
  );
}

interface HomePageClientProps {
  blogCategories: BlogCategory[];
  discountedProducts: ProductType[];
  featuredProducts: ProductType[];
  latestProducts: ProductType[];
  latestArticles: any[];
}

const PRODUCT_SLIDER_SETTINGS = {
  spaceBetween: 14,
  slidesPerView: 2,
  breakpoints: {
    480: { slidesPerView: 2, spaceBetween: 14 },
    640: { slidesPerView: 2, spaceBetween: 14 },
    768: { slidesPerView: 3, spaceBetween: 14 },
    1024: { slidesPerView: 4, spaceBetween: 14 },
    1280: { slidesPerView: 5, spaceBetween: 14 },
  },
  navigation: true,
  autoplay: true,
  autoplayDelay: 5000,
  imageQuality: 85,
  imageLoading: "eager" as const,
};

function ProductSliderSection({
  title,
  highlight,
  linkHref,
  badge,
  items,
  bgColor = "bg-white", // اضافه کردن prop برای بک‌گراند
}: {
  title: string;
  highlight: string;
  linkHref: string;
  badge: string;
  items: ProductType[];
  bgColor?: string;
}) {
  if (items.length === 0) return null;

  return (
    <section className="max-w-[1470px] mx-auto px-4">
      <div className={`${bgColor} rounded-xl p-5 border border-gray-100 hover:border-gray-200 transition-colors duration-200`}>
        <SectionHeader
          title={title}
          highlight={highlight}
          linkHref={linkHref}
          badge={badge}
        />
        <Slider items={items} Card={Card} {...PRODUCT_SLIDER_SETTINGS} />
      </div>
    </section>
  );
}

export default function HomePageClient({
  discountedProducts,
  blogCategories,
  featuredProducts,
  latestProducts,
  latestArticles,
}: HomePageClientProps) {
  return (
    <div className="space-y-10 pb-12">
      
      {/* ===== بخش تخفیف‌های ویژه ===== */}
      <ProductSliderSection
        title=" ویژه"
        highlight="تخفیف‌های"
        linkHref="/products/offers"
        badge="فرصت استثنایی"
        items={discountedProducts}
        bgColor="bg-gradient-to-br from-orange-50 to-amber-50" // بک‌گراند نارنجی کمرنگ
      />

      
      {/* ===== بنر تبلیغاتی بالایی ===== */}
      <section className="max-w-[1470px] mx-auto px-4">
        <PromoBanner />
      </section>

      {/* ===== جدیدترین محصولات ===== */}
      <ProductSliderSection
        title=" محصولات"
        highlight="جدید ترین"
        linkHref="/products?sort=newest"
        badge="تازه‌های بازار"
        items={latestProducts}
      />

      {/* ===== پرفروش‌ترین محصولات ===== */}
      <ProductSliderSection
        title=" محصولات "
        highlight="پرفروش‌ ترین"
        linkHref="/products?sort=popular"
        badge="محبوب‌ ترین‌ها"
        items={featuredProducts}
      />

      {/* ===== آخرین مطالب وبلاگ ===== */}
      {latestArticles.length > 0 && (
        <section className="max-w-[1470px] mx-auto px-4">
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <div className="flex flex-col lg:flex-row gap-6">
              
              {/* سایدبار دسته‌بندی‌ها */}
              <div className="lg:w-72 flex-shrink-0">
                <SectionHeader
                  title="  وبلاگ  "
                  highlight="   اخرین مطالب"
                  linkHref="/articles"
                  badge="خواندنی‌ها"
                />
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">دسته‌بندی‌ها</p>
                    <div className="h-px flex-1 bg-gray-200 mr-3" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {blogCategories.slice(0, 8).map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/articles?category=${cat.slug}`}
                        className="text-xs px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-900 rounded-md transition-all duration-200 border border-gray-200"
                      >
                        {cat.title}
                      </Link>
                    ))}
                  </div>
                </div>
                
                {/* کارت پیشنهاد ویژه */}
                <div className="mt-5 p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-1.5 mb-1">
                    <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-xs font-semibold text-amber-600">پیشنهاد ویژه</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    با مطالعه مقالات تخصصی ما، بهترین انتخاب را داشته باشید!
                  </p>
                </div>
              </div>
              
              {/* اسلایدر مقالات */}
              <div className="flex-1">
                <Slider
                  items={latestArticles}
                  Card={QuickBlogCard}
                  spaceBetween={20}
                  slidesPerView={1}
                  breakpoints={{
                    480: { slidesPerView: 1.2, spaceBetween: 16 },
                    640: { slidesPerView: 1.5, spaceBetween: 18 },
                    768: { slidesPerView: 2, spaceBetween: 20 },
                    1024: { slidesPerView: 2.5, spaceBetween: 20 },
                    1280: { slidesPerView: 3, spaceBetween: 20 },
                  }}
                  navigation={true}
                  imageQuality={90}
                  imageLoading="eager"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* هشدار برای تعداد کم مقالات */}
      {latestArticles.length > 0 && latestArticles.length < 3 && (
        <div className="max-w-[1470px] mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-600 text-xs px-3 py-1.5 rounded-full">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>به زودی مقالات اضافه خواهند شد</span>
          </div>
        </div>
      )}
    </div>
  );
}