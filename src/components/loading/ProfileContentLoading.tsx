export default function ProfileContentLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 w-48 rounded-lg bg-zinc-200" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="mb-3 h-4 w-24 rounded bg-zinc-200" />
            <div className="h-8 w-16 rounded bg-zinc-100" />
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-zinc-100" />
        ))}
      </div>
    </div>
  );
}
