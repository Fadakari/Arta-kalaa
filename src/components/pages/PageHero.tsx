interface PageHeroProps {
  badge?: string;
  title: string;
  highlight?: string;
  subtitle: string;
}

export default function PageHero({
  badge,
  title,
  highlight,
  subtitle,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-primary to-blue-600 px-6 py-14 sm:px-10 sm:py-16 lg:px-14 lg:py-20 text-white shadow-xl">
      <div className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />

      <div className="relative max-w-3xl">
        {badge && (
          <span className="mb-4 inline-flex items-center rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
            {badge}
          </span>
        )}
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
          {title}{" "}
          {highlight && (
            <span className="bg-gradient-to-l from-sky-300 to-white bg-clip-text text-transparent">
              {highlight}
            </span>
          )}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-blue-100 sm:text-lg">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
