export const revalidate = 120;

import BlogCard from "@/components/BlogCard";
import PaginationBox from "@/components/Products/PaginationBox";
import { articlesSchema, breadcrumbSchema } from "@/components/Schema";
import { GetBlogPosts } from "@/services/blogActions";
import Article from "@/types/blog";
import { Metadata } from "next";
import Script from "next/script";

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

const getCashedBlogPosts = async (searchParams: any) => {
  try {
    const search = await searchParams;
    return await GetBlogPosts(search);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return null;
  }
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const category = (await searchParams).category;

  let title = "مقالات آرتا کالا";
  let description = "آخرین مقالات و اخبار مرتبط با آرتا کالا را اینجا بخوانید.";
  if (category) {
    title = `مقالات دسته‌بندی ${category} | آرتا کالا`;
    description = `مقالات مرتبط با دسته‌بندی شماره ${category} در فروشگاه آرتا کالا.`;
  }

  return {
    title,
    description,
    keywords: [
      "مقالات",
      "آرتا کالا",
      "اخبار آرتا کالا",
      ...(category ? [`دسته‌بندی ${category}`] : []),
    ],
    openGraph: {
      title,
      description,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/articles${category ? `?category=${category}` : ""}`,
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

export default async function ArticlesPage({ searchParams }: PageProps) {
  const search = await searchParams;
  const result = await getCashedBlogPosts(search);
  const posts: Article[] = result?.data || [];

  if (!result) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center text-zinc-600">
        در حال حاضر امکان دریافت مقالات وجود ندارد. لطفاً چند لحظه بعد دوباره تلاش کنید.
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center text-zinc-600">
        مقاله‌ای برای نمایش وجود ندارد.
      </div>
    );
  }

  const breadcrumbs = [
    { name: "خانه", url: `${process.env.NEXT_PUBLIC_SITE_URL}/` },
    { name: "مقالات", url: `${process.env.NEXT_PUBLIC_SITE_URL}/articles` },
  ];
  const schema = [articlesSchema(posts), breadcrumbSchema(breadcrumbs)];

  return (
    <>
      <Script
        id="articles-jsonld"
        type="application/ld+json"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(posts || []).map((post: Article) => (
          <BlogCard key={post.id} item={post} />
        ))}
      </div>
      <div className="mt-10">
        <PaginationBox
          href="articles"
          searchParams={search}
          total={+result.total_pages || 1}
          page={1}
        />
      </div>
    </>
  );
}
