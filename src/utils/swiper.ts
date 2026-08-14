type SwiperBreakpoints = Record<
  string,
  { slidesPerView?: number | "auto"; slidesPerGroup?: number }
>;

export function getMaxSlidesPerView(
  slidesPerView: number,
  breakpoints: SwiperBreakpoints = {}
): number {
  const values = [slidesPerView];

  for (const bp of Object.values(breakpoints)) {
    if (typeof bp.slidesPerView === "number") {
      values.push(bp.slidesPerView);
    }
  }

  return Math.max(...values);
}

/** Swiper loop needs enough slides relative to the largest slidesPerView. */
export function canEnableSwiperLoop(
  slideCount: number,
  slidesPerView: number,
  breakpoints: SwiperBreakpoints = {},
  slidesPerGroup = 1,
  minimumSlides = 0
): boolean {
  if (slideCount <= 1) return false;

  const maxSlidesPerView = Math.ceil(
    getMaxSlidesPerView(slidesPerView, breakpoints)
  );

  const required = Math.max(
    maxSlidesPerView * 2 + (slidesPerGroup - 1),
    minimumSlides
  );

  return slideCount >= required;
}
