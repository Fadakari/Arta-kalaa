"use client";

import { useCallback, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/free-mode";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import Image from "next/image";

type Props = {
  images: any[];
};

const GallerySlider = ({ images }: Props) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const slides = images.map((img) => ({
    src: img.src,
    alt: img.alt,
  }));
  const swiperRef = useRef<any>(null);

  const goNext = useCallback(() => swiperRef.current?.slidePrev(), []);
  const goPrev = useCallback(() => swiperRef.current?.slideNext(), []);

  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, Thumbs]}
        navigation={false}
        thumbs={{ swiper: thumbsSwiper }}
        onSlideChange={(swiper) => setIndex(swiper.activeIndex)}
        className="rounded-xl"
        onSwiper={(swiper) => (swiperRef.current = swiper)}
      >
        {images.map((img) => (
          <SwiperSlide key={img.id}>
            <Image
              width={500}
              height={500}
              src={img.src}
              alt={img.alt}
              onClick={() => setOpen(true)}
              className="w-full h-[300px] sm:h-[500px] object-cover rounded-xl cursor-zoom-in"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        onSwiper={setThumbsSwiper}
        modules={[Thumbs, FreeMode]}
        spaceBetween={10}
        slidesPerView={Math.min(images.length, 6)}
        freeMode
        watchSlidesProgress
        className="mt-2"
      >
        {images.map((img) => (
          <SwiperSlide key={`thumb-${img.id}`} className="group">
            <Image
              width={130}
              height={130}
              src={img.src}
              alt={img.alt}
              className="h-34 w-full object-cover rounded-md border-2 border-transparent group-[.swiper-slide-thumb-active]:border-primary group-[.swiper-slide-thumb-active]:opacity-70 transition"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      {images.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="hidden sm:block absolute top-1/2 left-1 md:left-2 -translate-y-1/2 text-primary z-20 drop-shadow-xl hover:-translate-x-2 transition-transform ease-in-out"
            aria-label="Previous Slide"
          >
            <GoChevronLeft className="size-12 sm:size-14 lg:size-20" />
          </button>

          <button
            onClick={goNext}
            className="hidden sm:block absolute top-1/2 right-1 md:right-2 -translate-y-1/2 text-primary z-20 drop-shadow-xl hover:translate-x-2 transition-transform ease-in-out"
            aria-label="Next Slide"
          >
            <GoChevronRight className="size-12 sm:size-14 lg:size-20" />
          </button>
        </>
      )}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        index={index}
        on={{ view: ({ index }) => setIndex(index) }}
      />
    </div>
  );
};

export default GallerySlider;