"use client";

import BreadcrumbsBox from "./BreadcrumbsBox";
import { CategoryNode } from "@/types/categories";
import ProductType from "@/types/product";
import Products from "./Products";
import FilterBox from "./FilterBox";
import SortBox from "./SortBox";
import { useCategories } from "@/context/CategoriesContext";
type LayoutShellProps = {
  products: ProductType[];
  searchParams: any;
  pagination?: { count: number; page: number };
  categories: CategoryNode[];
  href?: string;
};
export default function LayoutShell({
  searchParams,
  products,
  pagination,
  href,
}: LayoutShellProps) {
  const categories = useCategories();
  const categoryId = searchParams.category_id;
  const selected =
    Object.keys(searchParams).length > 0 && !("sort" in searchParams);

  const findCategoryPath = (
    nodes: typeof categories,
    id: string | undefined,
    path: { id: number; name: string }[] = []
  ): { id: number; name: string }[] | null => {
    if (!id) return null;

    for (const node of nodes) {
      const newPath = [...path, { id: Number(node.id), name: node.name }];

      if (node.id.toString() === id) return newPath;

      if (node.children?.length) {
        const childPath = findCategoryPath(node.children, id, newPath);
        if (childPath) return childPath;
      }
    }

    return null;
  };

  const categoryPath =
    typeof categoryId === "string"
      ? findCategoryPath(categories, categoryId)
      : null;

  const breadcrumbItems = [
    { label: "خانه", href: "/" },
    { label: "محصولات", href: "/products" },
    ...(href === "products/offers"
      ? [{ label: "تخفیف‌های ویژه" }]
      : []),
    ...(categoryPath
      ? categoryPath.map((cat, index) => ({
          label: cat.name,
          href:
            index === categoryPath.length - 1
              ? undefined
              : `/products?category_id=${cat.id}`,
        }))
      : []),
  ];
  return (
    <div className={"space-y-5 container customSm:max-w-[566px]"}>
      <BreadcrumbsBox items={breadcrumbItems} />
      <section className="flex gap-4 w-full h-full ">
        <FilterBox selected={selected} />
        <div className="size-full space-y-5">
          <SortBox />
          <Products
            href={href}
            pagination={pagination}
            products={products}
            searchParams={searchParams}
          />
        </div>
      </section>
    </div>
  );
}
