export default function ProfileLayoutLoading() {
  return (
    <section className="container flex h-full animate-pulse flex-col gap-5 p-5 customSm:max-w-[566px] md:flex-row">
      <aside className="w-full space-y-3 md:w-1/4">
        <div className="h-10 rounded-xl bg-zinc-200" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-12 rounded-xl bg-zinc-100" />
        ))}
      </aside>
      <div className="h-[480px] rounded-2xl border border-zinc-200 bg-white p-5 shadow md:w-3/4">
        <div className="mb-6 h-8 w-40 rounded-lg bg-zinc-200" />
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 rounded-xl bg-zinc-100" />
          ))}
        </div>
      </div>
    </section>
  );
}
