import CardSkeleton from "@/components/Products/CardSkeleton";

export default function ProductsPageLoading() {
  return (
    <div className="container mx-auto animate-pulse space-y-5 customSm:max-w-[566px] px-2 py-6">
      <div className="flex flex-wrap items-center gap-2">
        <div className="h-4 w-12 rounded bg-zinc-200" />
        <div className="h-4 w-4 rounded bg-zinc-100" />
        <div className="h-4 w-20 rounded bg-zinc-200" />
      </div>

      <section className="flex w-full gap-4">
        <aside className="hidden w-64 shrink-0 space-y-4 lg:block">
          <div className="h-8 w-32 rounded-lg bg-zinc-200" />
          <div className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-4 rounded bg-zinc-100" style={{ width: `${70 + (i % 3) * 10}%` }} />
            ))}
          </div>
          <div className="space-y-3 rounded-xl border border-zinc-200 bg-white p-4">
            <div className="h-6 w-24 rounded bg-zinc-200" />
            <div className="h-2 w-full rounded-full bg-zinc-100" />
            <div className="flex justify-between gap-2">
              <div className="h-10 flex-1 rounded-lg bg-zinc-100" />
              <div className="h-10 flex-1 rounded-lg bg-zinc-100" />
            </div>
          </div>
        </aside>

        <div className="size-full flex-1 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="h-10 w-full rounded-xl bg-zinc-200 lg:w-80" />
            <div className="hidden h-8 w-48 rounded bg-zinc-100 lg:block" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
          <div className="flex justify-center gap-2 pt-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 w-10 rounded-full bg-zinc-200" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
