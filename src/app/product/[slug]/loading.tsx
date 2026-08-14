import CardSkeleton from "@/components/Products/CardSkeleton";

export default function Loading() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-2xl bg-zinc-200" />
        <div className="flex flex-col gap-4">
          <div className="h-10 w-3/4 animate-pulse rounded-lg bg-zinc-200" />
          <div className="h-6 w-1/3 animate-pulse rounded bg-zinc-100" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 w-full animate-pulse rounded bg-zinc-100" />
            ))}
          </div>
          <div className="mt-6 h-12 w-full animate-pulse rounded-xl bg-zinc-200" />
        </div>
      </div>
      <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
