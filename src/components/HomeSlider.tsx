"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { Autoplay, EffectFade } from "swiper/modules";
import Link from "next/link";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { canEnableSwiperLoop } from "@/utils/swiper";

function Slider({ images }: { images: any[] }) {
  const [isClient, setIsClient] = useState(false);
  const swiperRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="relative w-full h-[300px] sm:h-[380px] md:h-[450px] lg:h-[520px] animate-pulse overflow-hidden bg-gray-200 rounded-2xl" />
    );
  }

  const enableLoop = canEnableSwiperLoop(images.length, 1, {}, 1, 3);

  const goToSlide = (index: number) => {
    if (!swiperRef.current) return;
    if (enableLoop) {
      swiperRef.current.slideToLoop(index);
    } else {
      swiperRef.current.slideTo(index);
    }
  };

  return (
    <div
      className="relative w-full mx-auto"
      style={{ padding: 0 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ padding: 0, margin: "10px 15px 0 15px" }}>
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          centeredSlides={true}
          loop={enableLoop}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          speed={800}
          modules={[Autoplay, EffectFade]}
          className="w-full rounded-xl overflow-hidden"
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
        >
          {images.map((image, index) => (
            <SwiperSlide key={image.id || index}>
              <Link href={image.link || "#"} className="block w-full overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt || `اسلاید ${index + 1}`}
                  width={1920}
                  height={520}
                  priority={index < 2}
                  loading={index < 2 ? "eager" : "lazy"}
                  quality={85}
                  className="w-full h-auto max-h-[520px] object-cover transition-all duration-700 ease-out hover:scale-105"
                  style={{ width: "100%", height: "auto", margin: 0, padding: 0 }}
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className={`absolute top-1/2 left-4 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-500 hover:text-[#0d6efd] hover:bg-white hover:scale-110 transition-all duration-300 ${
              isHovered ? "opacity-100" : "opacity-0 sm:opacity-0"
            }`}
            aria-label="قبلی"
          >
            <GoChevronLeft className="size-4 sm:size-5" />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className={`absolute top-1/2 right-4 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-500 hover:text-[#0d6efd] hover:bg-white hover:scale-110 transition-all duration-300 ${
              isHovered ? "opacity-100" : "opacity-0 sm:opacity-0"
            }`}
            aria-label="بعدی"
          >
            <GoChevronRight className="size-4 sm:size-5" />
          </button>
        </>
      )}

      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-3">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="rounded-full transition-all duration-500 cursor-pointer"
              style={{
                width: index === activeIndex ? "24px" : "8px",
                height: "8px",
                backgroundColor: index === activeIndex ? "#0d6efd" : "#dee2e6",
              }}
              aria-label={`اسلاید ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Slider;