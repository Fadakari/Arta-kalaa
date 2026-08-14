"use client";
import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Pagination,
  Autoplay,
  Thumbs,
  Navigation,
  Keyboard,
} from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import { FaXmark } from "react-icons/fa6";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/thumbs";

interface ProductSliderProps {
  images: string[];
  alt?: string;
}

export default function ProductSlider({ images, alt }: ProductSliderProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const resetPreview = () => {
    setZoom(1);
    setRotation(0);
  };

  if (!images || images.length === 0) {
    return <div className="text-center text-gray-500">تصویری موجود نیست</div>;
  }

  return (
    <div className="w-full">
      <AnimatePresence>
        {previewImage && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/90 flex justify-center items-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={() => {
                setPreviewImage(null);
                resetPreview();
              }}
              className="absolute top-5 right-5 text-white text-2xl bg-black/50 rounded-full p-5 hover:bg-black transition"
            >
              <FaXmark />
            </button>

            <AnimatePresence>
              {previewImage && (
                <motion.div
                  className="fixed inset-0 z-50 bg-black/90 flex justify-center items-center p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <button
                    onClick={() => {
                      setPreviewImage(null);
                      resetPreview();
                    }}
                    className="absolute top-5 right-5 text-white text-2xl bg-black/50 rounded-full p-5 hover:bg-black transition"
                  >
                    <FaXmark />
                  </button>

                  <Swiper
                    initialSlide={images.indexOf(previewImage)}
                    modules={[Pagination, Navigation, Keyboard]}
                    navigation
                    keyboard
                    pagination={{ clickable: true }}
                    spaceBetween={16}
                    className="w-[90vw] h-[90vh]"
                  >
                    {images.map((img, index) => (
                      <SwiperSlide
                        key={index}
                        className="flex justify-center items-center"
                      >
                        <motion.div
                          className="relative w-full h-full"
                          style={{
                            transform: `scale(${zoom}) rotate(${rotation}deg)`,
                          }}
                        >
                          <Image
                            src={img}
                            alt={alt || `تصویر ${index + 1}`}
                            fill
                            className="object-contain"
                          />
                        </motion.div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <Swiper
        modules={[Pagination, Autoplay, Thumbs]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        thumbs={{ swiper: thumbsSwiper }}
        spaceBetween={16}
        className="w-full flex"
      >
        {images.map((img, index) => (
          <SwiperSlide
            key={index}
            className="flex justify-center items-center cursor-zoom-in relative"
            onClick={() => setPreviewImage(img)}
          >
            <div className="relative w-full  aspect-[4/3]">
              <Image
                src={img}
                alt={`${alt || "محصول"} - تصویر ${index + 1}`}
                fill
                className="object-contain rounded-lg hover:scale-105 transition duration-300 "
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>

            {images.length > 1 && (
              <span className="absolute bottom-2 right-2 text-xs bg-black/60 text-white px-2 py-1 rounded-md">
                {index + 1} / {images.length}
              </span>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {images.length > 1 && (
        <Swiper
          onSwiper={setThumbsSwiper}
          modules={[Thumbs]}
          slidesPerView={5}
          spaceBetween={12}
          className="mt-3"
        >
          {images.map((img, index) => (
            <SwiperSlide key={index} className="cursor-pointer group">
              <div className="relative w-20 h-20">
                <Image
                  src={img}
                  alt={`تصویر ${index + 1}`}
                  fill
                  className="object-cover rounded-md border-2 border-transparent opacity-70 group-[.swiper-slide-thumb-active]:opacity-100 group-[.swiper-slide-thumb-active]:border-primary-400 transition"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      <style jsx global>{`
        .swiper-pagination-bullet {
          background: #3b82f6;
          opacity: 0.6;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          background: #2563eb;
          transform: scale(1.3);
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
