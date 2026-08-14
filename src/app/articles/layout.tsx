import CategoryTree from "@/components/CategoryTree";
import BreadcrumbsBox from "@/components/Products/BreadcrumbsBox";
import { GetBlogCategoriesMenuStructure } from "@/services/blogActions";
import { BlogCategoryNode } from "@/types/categories";
import { ReactNode, Suspense } from "react";
import { FaFilter } from "react-icons/fa";

function CategorySidebarSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="h-5 rounded bg-zinc-200"
          style={{ width: `${60 + (i % 4) * 10}%` }}
        />
      ))}
    </div>
  );
}

async function ArticlesCategorySidebar() {
  const rawCategories = await GetBlogCategoriesMenuStructure();
  const categories: BlogCategoryNode[] = Array.isArray(rawCategories)
    ? rawCategories
    : [];

  return (
    <>
      <div className="hidden lg:flex">
        <CategoryTree categories={categories} />
      </div>
      <div className="lg:hidden flex">
        <CategoryTree categories={categories} isMobile />
      </div>
    </>
  );
}

async function layout({ children }: { children: ReactNode }) {
  return (
    <>
      <BreadcrumbsBox
        title="مقالات"
        items={[{ label: "خانه", href: "/" }, { label: "مقالات" }]}
      />
      <div className="flex flex-col lg:flex-row gap-2 py-10 container customSm:max-w-[566px]">
        <aside className="w-full lg:w-1/3  pl-4">
          <h3 className="lg:flex hidden text-2xl font-semibold mb-4  gap-2 items-center">
            <FaFilter />
            دسته‌بندی‌ها
          </h3>
          <Suspense fallback={<CategorySidebarSkeleton />}>
            <ArticlesCategorySidebar />
          </Suspense>
        </aside>
        <div className="w-full">
          <h1 className="text-4xl font-semibold mb-4 flex gap-2 items-center">
            مقالات
          </h1>
          {children}
        </div>
      </div>
    </>
  );
}

export default layout;
