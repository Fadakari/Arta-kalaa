import {
  GetBlogBySlug,
  GetBlogCategoriesMenuStructure,
  GetLatestBlogPosts,
} from "@/services/blogActions";
import Article from "@/types/blog";
import { SITE_URL } from "@/lib/urls";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaFolderOpen } from "react-icons/fa6";
import { HiMiniCalendarDateRange } from "react-icons/hi2";
import parse from "html-react-parser";
import sanitizeHtml from "sanitize-html";
import moment from "moment-jalaali";
import { Metadata } from "next";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import { articleSchema, breadcrumbSchema } from "@/components/Schema";
import { imageSchema } from "@/components/Schema/imageSchema";
import Script from "next/script";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const data = await GetBlogBySlug((await params).slug);
  if (!data) {
    return {
      title: "مقاله یافت نشد | آرتا کالا",
    };
  }
  return {
    title: `${data.title} | آرتا کالا`,
    description: data.introduction,
    keywords: [data.title, "مقاله آرتا کالا", `مقاله ${data.title}`],
    openGraph: {
      title: data.title,
      description: data.introduction,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/article/${data.slug}`,
      siteName: "آرتا کالا",
      locale: "fa_IR",
      type: "article",
      publishedTime: data.published_at || data.created_at,
      modifiedTime: data.updated_at,
      images: [
        {
          url: data.thumbnail,
          alt: data.title,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.introduction,
      images: [data.thumbnail],
    },
    robots: {
      index: true,
      follow: true,
      nocache: true,
    },
  };
}

async function page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const data = await GetBlogBySlug(decodedSlug);
  
  if (!data) return notFound();
  
  const categories = await GetBlogCategoriesMenuStructure();
  const latestPostsRaw = await GetLatestBlogPosts();
  
  // ✅ اصلاح شده - GetLatestBlogPosts قبلاً آرایه برمی‌گرداند
  // فقط نیاز به اطمینان از آرایه بودن داریم
  let latestPostsArray: Article[] = [];
  if (Array.isArray(latestPostsRaw)) {
    latestPostsArray = latestPostsRaw;
  } else {
    latestPostsArray = [];
  }
  
  const filteredLatestPosts = latestPostsArray.filter(
    (post: Article) => post.slug !== data.slug
  );
  
  const formatPersianDate = (jalaliDate: string) => {
    moment.loadPersian({ dialect: "persian-modern", usePersianDigits: true });
    return moment(jalaliDate, "jYYYY-jMM-jDD").format("jDD jMMMM jYYYY");
  };

  const siteUrl = SITE_URL;

  const breadcrumbs = [
    { name: "خانه", url: `${siteUrl}/` },
    { name: "محصولات", url: `${siteUrl}/products` },
    data.category
      ? {
          name: data.category.title,
          url: `${siteUrl}/products?category_id=${data.category.id}`,
        }
      : { name: data.category },
    { name: data.title, url: `${siteUrl}/article/${data.slug}` },
  ];

  const schema = [
    articleSchema(data),
    breadcrumbSchema(breadcrumbs),
    imageSchema(data.thumbnail, data.title),
  ];
  
  return (
    <>
      <Script
        id="article-jsonld"
        type="application/ld+json"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <ReadingProgressBar />

      <div
        id="article-content"
        className="flex flex-col md:flex-row gap-8 p-5 font-pelak container max-w-full md:max-w-[1140px] customSm:max-w-[566px]"
      >
        <div className="w-full md:w-3/4 bg-white py-6 px-5 md:py-10 md:px-20 shadow-xl rounded-2xl">
          <h1 className="text-2xl md:text-3xl font-semibold">{data.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-primary-700 mt-3">
            <p className="flex items-center gap-1 text-sm md:text-base">
              <HiMiniCalendarDateRange className="size-5" />
              <span>{formatPersianDate(data.jalali_created)}</span>
            </p>
            <Link
              href={`/articles?category_id=${data.category.id}`}
              className="flex items-center gap-1 text-sm md:text-base"
            >
              <FaFolderOpen className="size-5" />
              <span>{data.category.title}</span>
            </Link>
          </div>
          <p className="text-zinc-600 mb-3 mt-5 text-sm md:text-base">
            {data.introduction}
          </p>
          <Image
            src={data.thumbnail}
            alt={data.title}
            width={720}
            height={445}
            priority
            className="object-cover w-full h-auto aspect-video rounded-lg"
            unoptimized={true}
          />
          <div className="article-content !text-black prose prose-sm md:prose md:prose-invert max-w-full mt-7">
            {parse(sanitizeHtml(data.content))}
          </div>
        </div>

        <aside className="w-full md:w-1/4 flex flex-col gap-5 sticky top-20">
          <div className="bg-white shadow md:shadow-2xl p-4 rounded-xl">
            <h2 className="text-2xl md:text-3xl py-4 font-pelak text-[#d55931] font-bold">
              دسته بندی ها
            </h2>
            <ul className="font-pelak text-sm md:text-base">
              {categories?.map((cat, key) => (
                <li key={key} className="mb-2">
                  <Link href={`/articles?category=${cat.slug}`}>
                    {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {filteredLatestPosts && filteredLatestPosts.length > 0 && (
            <div className="bg-white shadow md:shadow-2xl p-4 rounded-xl">
              <h2 className="text-2xl md:text-3xl py-4 mb-3 font-pelak text-[#d55931] font-bold">
                آخرین مطالب
              </h2>
              <ul className="font-pelak space-y-5 text-sm md:text-base">
                {filteredLatestPosts.slice(0, 5).map((post: Article) => (
                  <li key={post.id} className="flex items-start gap-4">
                    <Link href={`/article/${post.slug}`}>
                      <Image
                        src={post.thumbnail}
                        alt=""
                        width={100}
                        height={100}
                        className="w-44 h-24 md:w-20 md:h-16 lg:w-32 lg:h-20 object-cover rounded-2xl"
                        unoptimized={true}
                      />
                    </Link>
                    <div className="flex flex-col justify-start items-start">
                      <Link
                        href={`/article/${post.slug}`}
                        className="font-semibold text-xl md:text-base"
                      >
                        {post.title}
                      </Link>
                      <p className="p-1 bg-primary-100 text-primary-600 font-semibold text-xs md:text-sm mt-1">
                        {formatPersianDate(post.jalali_created)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}

export default page;