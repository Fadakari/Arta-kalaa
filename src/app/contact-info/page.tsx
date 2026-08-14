import BreadcrumbsBox from "@/components/Products/BreadcrumbsBox";
import PageHero from "@/components/pages/PageHero";
import ContactCards from "@/components/pages/ContactCards";
import { homeContactInfoList } from "@/services/homeActions";
import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "ارتباط با ما | آرتا کالا",
  description:
    "راه‌های تماس با فروشگاه آرتا کالا؛ آدرس، شماره تلفن و اطلاعات پشتیبانی جهت ارتباط سریع و آسان با ما.",
  keywords: [
    "ارتباط با ما",
    "تماس با آرتا کالا",
    "فروشگاه آرتا کالا",
    "آدرس آرتا کالا",
    "شماره تلفن آرتا کالا",
  ],
  openGraph: {
    title: "ارتباط با ما | آرتا کالا",
    description:
      "راه‌های تماس با فروشگاه آرتا کالا؛ آدرس، شماره تلفن و اطلاعات پشتیبانی.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/contact-info`,
    siteName: "آرتا کالا",
    locale: "fa_IR",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default async function ContactInfoPage() {
  const result = await homeContactInfoList();
  const contactInfo = result?.data || [];
  const address =
    contactInfo[0]?.address ||
    "یزد، خیابان شهید رجایی، نبش کوچه ۳۰، آرتاکالا";

  return (
    <div className="pb-16">
      <BreadcrumbsBox
        title="ارتباط با ما"
        items={[{ label: "خانه", href: "/" }, { label: "ارتباط با ما" }]}
      />

      <div className="container mx-auto space-y-12 px-2 sm:px-4">
        <PageHero
          badge="همیشه در دسترس"
          title="با ما"
          highlight="در تماس باشید"
          subtitle="تیم پشتیبانی آرتا کالا آماده پاسخگویی به سوالات، راهنمایی خرید و پیگیری سفارش‌های شماست. از هر کانالی که راحت‌تر هستید با ما ارتباط بگیرید."
        />

        <ContactCards contacts={contactInfo} />

        <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg">
          <div className="grid lg:grid-cols-5">
            <div className="flex flex-col justify-center p-6 sm:p-8 lg:col-span-2">
              <span className="mb-3 inline-flex w-fit rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary">
                موقعیت مکانی
              </span>
              <h2 className="text-2xl font-bold text-gray-900">
                آدرس فروشگاه
              </h2>
              <p className="mt-4 leading-8 text-gray-600">{address}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-primary-700"
              >
                مسیریابی در گوگل مپ
                <ChevronLeft className="size-4" />
              </a>
            </div>

            <div className="relative min-h-[280px] bg-gradient-to-br from-blue-100 via-primary-100 to-sky-50 lg:col-span-3">
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="w-full max-w-lg rounded-2xl border border-white/60 bg-white/80 p-8 text-center shadow-xl backdrop-blur-sm">
                  <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary text-3xl text-white">
                    📍
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    آرتا کالا — یزد
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-gray-600">
                    {address}
                  </p>
                  <p className="mt-4 text-xs text-gray-400">
                    برای مراجعه حضوری، پیش از مراجعه تماس بگیرید.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-blue-100 bg-gradient-to-l from-blue-50 to-white p-8 text-center sm:p-10">
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
            سوالی درباره محصولات دارید؟
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-gray-500">
            کارشناسان ما آماده مشاوره رایگان قبل از خرید هستند. همین حالا
            پیام بدهید.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://wa.me/9891330176574"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-bold text-white shadow-md transition hover:bg-green-600"
            >
              چت در واتساپ
            </a>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl border border-primary px-6 py-3 font-medium text-primary transition hover:bg-primary hover:text-white"
            >
              مشاهده محصولات
              <ChevronLeft className="size-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
