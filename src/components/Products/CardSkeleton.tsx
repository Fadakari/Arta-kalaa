function CardSkeleton() {
  return (
    <div className="bg-white shadow rounded-lg p-3.5 sm:p-5 w-full h-full animate-pulse">
      <div className="relative">
        <div className="w-full h-56 bg-zinc-200 rounded-t-lg" />
      </div>
      <div className="mt-2 mb-10 space-y-2">
        <div className="h-4 bg-zinc-200 rounded w-3/4" />
        <div className="h-4 bg-zinc-200 rounded w-1/2" />
      </div>

      <div className="flex w-full justify-between items-center">
        <div className="rounded-xs p-2.5 bg-zinc-200 flex items-center gap-2 w-10 h-10" />
        <div className="flex flex-col items-end gap-2">
          <div className="h-4 bg-zinc-200 rounded w-16" />
          <div className="h-6 bg-zinc-200 rounded w-24" />
        </div>
      </div>
    </div>
  );
}

export default CardSkeleton;
