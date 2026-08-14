// components/Slider.tsx - نسخه اصلاح شده کامل
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import Link from "next/link";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { canEnableSwiperLoop } from "@/utils/swiper";

interface SliderProps {
  images?: any[];
  items?: any[];
  Card?: React.ComponentType<{ item: any }>;
  spaceBetween?: number;
  slidesPerView?: number;
  breakpoints?: any;
  className?: string;
  navigation?: boolean;
  autoplay?: boolean;
  autoplayDelay?: number;
  imageQuality?: number;
  imageLoading?: "lazy" | "eager";
}

export default function Slider({ 
  images, 
  items, 
  Card, 
  spaceBetween = 16, 
  slidesPerView = 1,
  breakpoints = {}, 
  className = "",
  navigation = false,
  autoplay = false,
  autoplayDelay = 5000,
  imageQuality = 85,
  imageLoading = "lazy"
}: SliderProps) {
  const [isClient, setIsClient] = useState(false);
  const swiperRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isImageSlider = images && images.length > 0;
  const dataItems = isImageSlider ? images : items;
  const hasMultipleItems = dataItems && dataItems.length > 1;
  const CardComponent = Card;
  
  // اصلاح: برای اسلایدر غیرتصویری، از prop autoplay استفاده کن
  const shouldAutoplay = isImageSlider ? true : autoplay;
  
  // فقط در صورتی autoplay فعال شود که آیتم‌های متعدد وجود داشته باشد
  const useAutoplay = shouldAutoplay && hasMultipleItems;
  
  const enableLoop = Boolean(
    dataItems &&
      canEnableSwiperLoop(
        dataItems.length,
        slidesPerView,
        breakpoints,
        1,
        isImageSlider ? 3 : 0
      )
  );

  const goToSlide = (index: number) => {
    if (!swiperRef.current) return;
    if (enableLoop) {
      swiperRef.current.slideToLoop(index);
    } else {
      swiperRef.current.slideTo(index);
    }
  };

  if (!isClient) {
    const skeletonHeight = isImageSlider
      ? "h-[200px] sm:h-[280px] md:h-[320px] lg:h-[380px]"
      : "h-64 sm:h-72";
    return (
      <div className={`relative w-full ${skeletonHeight} animate-pulse overflow-hidden bg-gray-200 rounded-2xl ${className}`} />
    );
  }

  if (!dataItems || dataItems.length === 0) {
    return null;
  }

  // تنظیمات autoplay
  const autoplayConfig = useAutoplay ? {
    delay: autoplayDelay,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
    waitForTransition: true,
    stopOnLastSlide: false,
  } : false;

  // انتخاب ماژول‌های مورد نیاز
  const swiperModules = [Navigation];
  if (useAutoplay) swiperModules.push(Autoplay);
  if (isImageSlider) swiperModules.push(EffectFade);

  return (
    <div
      className={`relative w-full mx-auto ${className}`}
      style={{ padding: 0 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ padding: 0, margin: isImageSlider ? "10px 15px 0 15px" : 0 }}>
        <Swiper
          spaceBetween={spaceBetween}
          slidesPerView={slidesPerView}
          breakpoints={breakpoints}
          centeredSlides={isImageSlider}
          loop={enableLoop}
          effect={isImageSlider ? "fade" : undefined}
          fadeEffect={{ crossFade: true }}
          autoplay={autoplayConfig}
          speed={isImageSlider ? 800 : 600}
          slidesPerGroup={1}
          dir="rtl"
          modules={swiperModules}
          className={`w-full ${!isImageSlider ? "overflow-visible [&_.swiper-wrapper]:items-stretch" : "rounded-xl overflow-hidden"}`}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          navigation={navigation ? {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          } : false}
        >
          {dataItems.map((item, index) => (
            <SwiperSlide
              key={item.id || index}
              className={!isImageSlider ? "!h-auto flex" : undefined}
            >
              {isImageSlider ? (
                <Link href={item.link || "#"} className="block w-full overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.alt || `اسلاید ${index + 1}`}
                    width={1920}
                    height={520}
                    priority={index < 2}
                    loading={imageLoading}
                    quality={imageQuality}
                    className="w-full h-auto max-h-[520px] object-cover transition-all duration-700 ease-out hover:scale-105"
                    style={{ width: "100%", height: "auto", margin: 0, padding: 0 }}
                  />
                </Link>
              ) : (
                CardComponent && (
                  <div className="w-full h-full">
                    <CardComponent item={item} />
                  </div>
                )
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* دکمه‌های ناوبری برای اسلایدر محصولات */}
      {navigation && !isImageSlider && hasMultipleItems && (
        <>
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className={`absolute top-1/2 -right-3 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-50 hover:scale-110 transition-all duration-300 ${
              isHovered ? "opacity-100" : "opacity-0 sm:opacity-0"
            }`}
            aria-label="قبلی"
          >
            <GoChevronRight className="size-4 sm:size-5" />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className={`absolute top-1/2 -left-3 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-50 hover:scale-110 transition-all duration-300 ${
              isHovered ? "opacity-100" : "opacity-0 sm:opacity-0"
            }`}
            aria-label="بعدی"
          >
            <GoChevronLeft className="size-4 sm:size-5" />
          </button>
        </>
      )}

      {/* دکمه‌های ناوبری برای اسلایدر تصاویر */}
      {navigation && isImageSlider && hasMultipleItems && (
        <>
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className={`absolute top-1/2 left-4 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-white hover:scale-110 transition-all duration-300 ${
              isHovered ? "opacity-100" : "opacity-0 sm:opacity-0"
            }`}
            aria-label="قبلی"
          >
            <GoChevronLeft className="size-4 sm:size-5" />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className={`absolute top-1/2 right-4 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-white hover:scale-110 transition-all duration-300 ${
              isHovered ? "opacity-100" : "opacity-0 sm:opacity-0"
            }`}
            aria-label="بعدی"
          >
            <GoChevronRight className="size-4 sm:size-5" />
          </button>
        </>
      )}

      {/* دات‌های نمایش اسلایدها برای اسلایدر تصاویر */}
      {isImageSlider && hasMultipleItems && (
        <div className="flex justify-center gap-2 mt-3">
          {dataItems.map((_, index) => (
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