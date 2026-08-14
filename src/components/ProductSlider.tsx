"use client";
import "swiper/css";
import { ShoppingBasket } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useRef } from "react";

const products = [
  {
    id: 1,
    title: "ساعت هوشمند شیائومی",
    subtitle: "Mibro Lite XPAW004 Smartwatch",
    img: "assets/image/product/wach1.jpg",
    newPrice: "3,175,000 تومان",
    oldPrice: "6,500,000 تومان",
    discount: "40% تخفیف",
    rating: 4.8,
    votes: 15,
  },
  {
    id: 2,
    title: "ساعت هوشمند شیائومی",
    subtitle: "Mibro Lite XPAW004 Smartwatch",
    img: "assets/image/product/wach4.jpg",
    newPrice: "3,175,000 تومان",
    oldPrice: "6,500,000 تومان",
    discount: "40% تخفیف",
    rating: 4.8,
    votes: 15,
  },
  {
    id: 3,
    title: "ساعت هوشمند شیائومی",
    subtitle: "Mibro Lite XPAW004 Smartwatch",
    img: "assets/image/product/wach2.jpg",
    newPrice: "3,175,000 تومان",
    oldPrice: "6,500,000 تومان",
    discount: "40% تخفیف",
    rating: 4.8,
    votes: 15,
  },
];

export default function ProductSlider() {
  const progressRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative h-full">
      {/* Progress bar بالا */}
      <div className="w-full h-1 bg-gray-200 rounded-full mb-2 overflow-hidden">
        <div
          ref={progressRef}
          className="h-full bg-blue-500"
          style={{ width: "0%" }}
        />
      </div>

      <Swiper
        modules={[Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        onAutoplayTimeLeft={(_, __, progress) => {
          if (progressRef.current) {
            progressRef.current.style.width = `${(1 - progress) * 100}%`;
          }
        }}
        className="pb-10 h-full"
      >
        {products.map((p) => (
          <SwiperSlide key={p.id} className="h-full">
            <div className="bg-white rounded-2xl shadow-md p-3 flex flex-col justify-between gap-3 h-full">
              <div className="flex items-center justify-between">
                <span className="bg-red-100 text-red-500 text-xl px-3 py-1 rounded-xl">
                  {p.discount}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="h-48 flex justify-center items-center overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.title}
                    className="h-full object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                  />
                </div>

                <div>
                  <p className="font-bold truncate text-2xl">{p.title}</p>
                </div>
              </div>
              <div className="flex items-center justify-between bg-gray-100 rounded-lg p-2">
                <div>
                  <p className="font-bold text-xl">{p.newPrice}</p>
                </div>
                <button className="bg-primary btn text-white px-3 py-4 rounded-2xl flex items-center gap-2 transition text-xl">
                  <ShoppingBasket className="size-6" />
                  خرید محصول
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
