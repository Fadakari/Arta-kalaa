export default function Loading() {
  return (
    <div className="flex flex-col md:flex-row gap-8 p-5 font-pelak container max-w-full md:max-w-[1140px] customSm:max-w-[566px] ">
      <div className="w-full md:w-3/4 bg-white py-6 px-5 md:py-10 md:px-20 shadow-xl rounded-2xl space-y-5">
        <div className="h-8 w-3/4 bg-zinc-200 rounded" />

        <div className="flex items-center gap-5">
          <div className="h-5 w-32 bg-zinc-200 rounded" />
          <div className="h-5 w-24 bg-zinc-200 rounded" />
        </div>

        <div className="h-4 w-1/2 bg-zinc-200 rounded mt-4" />

        <div className="w-full h-96 bg-zinc-300 rounded-xl" />

        <div className="space-y-3 mt-6 max-h-[300px] overflow-hidden">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-4 w-full bg-zinc-200 rounded" />
          ))}
          <div className="w-full h-96 bg-zinc-300 rounded-xl" />
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-4 w-full bg-zinc-200 rounded" />
          ))}
        </div>
      </div>

      <div className="w-full md:w-1/4 flex flex-col gap-5 sticky top-20">
        <div className="bg-white shadow-2xl p-4 rounded-xl space-y-4">
          <div className="h-8 w-32 bg-zinc-200 rounded" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="h-4 w-3/4 bg-zinc-200 rounded" />
            ))}
          </div>
        </div>

        <div className="bg-white shadow-2xl p-4 rounded-xl space-y-4">
          <div className="h-8 w-36 bg-zinc-200 rounded" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="w-32 h-20 bg-zinc-300 rounded-xl" />
                <div className="flex flex-col gap-2">
                  <div className="h-4 w-36 bg-zinc-200 rounded" />
                  <div className="h-3 w-24 bg-zinc-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
