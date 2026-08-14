import { BlogCardSkeleton } from "@/components/BlogCard";

export default function ArticlesPageLoading() {
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
      {Array.from({ length: 9 }).map((_, index) => (
        <BlogCardSkeleton key={index} />
      ))}
    </div>
  );
}
