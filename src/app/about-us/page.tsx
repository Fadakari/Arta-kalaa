import BreadcrumbsBox from "@/components/Products/BreadcrumbsBox";
import PageHero from "@/components/pages/PageHero";
import AboutStats from "@/components/pages/AboutStats";
import FeatureCard from "@/components/home/FeatureCard";
import { homeAboutUsList } from "@/services/homeActions";
import { FEATURES } from "@/constants/home";
import { fixImageUrl } from "@/lib/urls";
import parse, { DOMNode, Element } from "html-react-parser";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import sanitizeHtml from "sanitize-html";
import { ChevronLeft } from "lucide-react";

export const revalidate = 300;

interface AboutSection {
  description: string;
  id: number;
  image: string | null;
  order: number;
  title: string;
  video: string | null;
}

export const metadata: Metadata = {
  title: "درباره ما | آرتا کالا",
  description:
    "با آرتا کالا آشنا شوید؛ داستان ما، اهداف، و خدماتی که به شما ارائه می‌دهیم. فروشگاهی مطمئن با محصولات باکیفیت و پشتیبانی حرفه‌ای.",
  keywords: [
    "درباره ما",
    "آرتا کالا",
    "فروشگاه آرتا کالا",
    "داستان آرتا کالا",
    "خدمات آرتا کالا",
  ],
  openGraph: {
    title: "درباره ما | آرتا کالا",
    description:
      "با آرتا کالا آشنا شوید؛ داستان ما، اهداف، و خدماتی که به شما ارائه می‌دهیم.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/about-us`,
    siteName: "آرتا کالا",
    locale: "fa_IR",
    type: "website",
  },
  robots: { index: true, follow: true },
};

const transform = (node: DOMNode) => {
  if (node.type === "tag" && node.name === "img") {
    const { src, alt, width, height } = (node as Element).attribs;
    if (!src) return null;

    return (
      <Image
        src={fixImageUrl(src)}
        alt={alt || ""}
        width={width ? parseInt(width) : 600}
        height={height ? parseInt(height) : 400}
        className="mx-auto max-h-80 max-w-full rounded-xl object-contain"
      />
    );
  }
};

export default async function AboutUsPage() {
  const result = await homeAboutUsList();
  const aboutUs: AboutSection[] = result?.data || [];

  return (
    <div className="pb-16">
      <BreadcrumbsBox
        title="درباره ما"
        items={[{ label: "خانه", href: "/" }, { label: "درباره ما" }]}
      />

      <div className="container mx-auto space-y-12 px-2 sm:px-4">
        <PageHero
          badge="فروشگاه تخصصی ابزار"
          title="داستان"
          highlight="آرتا کالا"
          subtitle="ما در آرتا کالا با هدف ارائه بهترین ابزار و تجهیزات با قیمت منصفانه، ارسال سریع و پشتیبانی واقعی شروع کردیم. اعتماد شما، بزرگ‌ترین سرمایه ماست."
        />

        <AboutStats />

        {aboutUs.length > 0 ? (
          <section className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                بیشتر درباره ما
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-gray-500">
                آنچه آرتا کالا را از دیگران متمایز می‌کند
              </p>
            </div>

            <div className="space-y-8">
              {aboutUs
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                .map((about, index) => {
                  const sanitizedHtml = sanitizeHtml(about.description, {
                    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
                      "img",
                    ]),
                    allowedAttributes: {
                      ...sanitizeHtml.defaults.allowedAttributes,
                      img: ["src", "alt", "width", "height", "class", "style"],
                      a: ["href", "name", "target", "class"],
                    },
                    transformTags: {
                      a: (tagName, attribs) => ({
                        tagName: "a",
                        attribs: {
                          ...attribs,
                          class:
                            (attribs.class || "") +
                            " text-primary hover:text-primary-700 underline-offset-4 hover:underline",
                        },
                      }),
                    },
                  });

                  const isReversed = index % 2 === 1;

                  return (
                    <article
                      key={about.id}
                      className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg"
                    >
                      <div
                        className={`grid gap-0 lg:grid-cols-2 ${isReversed ? "lg:[direction:ltr]" : ""}`}
                      >
                        {(about.image || about.video) && (
                          <div
                            className={`relative min-h-[260px] bg-gradient-to-br from-primary-100 to-blue-50 p-6 lg:min-h-[360px] ${isReversed ? "lg:[direction:rtl]" : ""}`}
                          >
                            {about.image && (
                              <Image
                                width={800}
                                height={600}
                                src={fixImageUrl(about.image)}
                                alt={about.title}
                                className="h-full w-full rounded-2xl object-cover shadow-md"
                              />
                            )}
                            {about.video && !about.image && (
                              <video
                                className="h-full w-full rounded-2xl object-cover shadow-md"
                                controls
                                preload="metadata"
                              >
                                <source src={about.video} type="video/mp4" />
                              </video>
                            )}
                          </div>
                        )}

                        <div
                          className={`flex flex-col justify-center p-6 sm:p-8 lg:p-10 ${isReversed ? "lg:[direction:rtl]" : ""}`}
                        >
                          <span className="mb-3 inline-flex w-fit rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary">
                            بخش {index + 1}
                          </span>
                          <h3 className="text-2xl font-bold text-gray-900">
                            {about.title}
                          </h3>
                          <div className="prose prose-sm mt-4 max-w-none text-gray-600 [&_p]:leading-8">
                            {parse(sanitizedHtml, { replace: transform })}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
            </div>
          </section>
        ) : (
          <section className="rounded-3xl border border-dashed border-gray-200 bg-white p-10 text-center text-gray-500">
            محتوای درباره ما به‌زودی تکمیل می‌شود.
          </section>
        )}

        <section>
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              چرا آرتا کالا؟
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-gray-500">
              مزایایی که خرید از ما را به تجربه‌ای مطمئن تبدیل می‌کند
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {FEATURES.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-primary via-blue-700 to-blue-900 px-6 py-12 text-center text-white sm:px-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.15),transparent_50%)]" />
          <div className="relative">
            <h2 className="text-2xl font-bold sm:text-3xl">
              آماده شروع خرید هستید؟
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-blue-100">
              هزاران محصول با گارانتی اصالت، ارسال سریع و پشتیبانی حرفه‌ای در
              انتظار شماست.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-primary shadow-lg transition hover:bg-blue-50"
              >
                مشاهده فروشگاه
                <ChevronLeft className="size-5" />
              </Link>
              <Link
                href="/contact-info"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3 font-medium text-white transition hover:bg-white/10"
              >
                تماس با ما
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
