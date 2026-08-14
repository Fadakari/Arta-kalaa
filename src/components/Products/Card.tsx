"use client";

import ProductType from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { CiImageOff } from "react-icons/ci";
import { ShoppingBasket } from "lucide-react";
import { useState } from "react";

export default function Card({
  item,
  href,
  className,
}: {
  item: ProductType;
  href?: string;
  className?: string;
}) {
  const [imgError, setImgError] = useState(false);

  const originalPrice = item.unit_price ?? item.price ?? 0;
  const finalPrice = item.final_price ?? item.discount_price ?? originalPrice;

  const hasDiscount = finalPrice < originalPrice;

  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
    : 0;

  const isAvailable =
    item.is_available !== undefined
      ? item.is_available
      : item.isDiscounted || true;

  return (
    <div
      title={item.name}
      className={`relative w-full h-full bg-white rounded-2xl shadow-md sm:shadow-lg p-3 sm:p-3.5 grid grid-rows-[11rem_2.75rem_1rem_2.75rem_auto] sm:grid-rows-[12rem_2.75rem_1rem_2.75rem_auto] gap-y-2 transition hover:shadow-xl ${className ?? ""}`}
    >
      {hasDiscount && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-red-100 text-red-500 px-2 sm:px-3 py-1 rounded-xl text-xs font-bold">
            {discountPercent.toLocaleString("fa-IR")}٪ تخفیف
          </span>
        </div>
      )}

      {/* تصویر */}
      <div className="flex justify-center items-center overflow-hidden rounded-xl bg-gray-50">
        {!imgError && item.cover_image ? (
          <Image
            src={item.cover_image}
            alt={`${item.name} - آرتا کالا`}
            width={400}
            height={300}
            className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <CiImageOff className="size-12 sm:size-16 text-gray-400" />
        )}
      </div>

      <h3 className="font-bold text-sm sm:text-base text-zinc-800 line-clamp-2 leading-snug">
        {item.name}
      </h3>

      <p className="text-xs text-zinc-400 truncate">
        {item.category || "\u00A0"}
      </p>

      <div className="flex flex-col justify-center gap-0.5">
        {isAvailable ? (
          hasDiscount ? (
            <>
              <p className="line-through text-xs sm:text-sm text-zinc-500">
                {originalPrice.toLocaleString("fa-IR")} تومان
              </p>
              <p className="font-bold text-base sm:text-lg text-red-600">
                {finalPrice.toLocaleString("fa-IR")} تومان
              </p>
            </>
          ) : (
            <p className="font-bold text-base sm:text-lg text-zinc-800">
              {originalPrice.toLocaleString("fa-IR")} تومان
            </p>
          )
        ) : (
          <p className="font-bold text-sm sm:text-base text-orange-600">
            ❌ ناموجود
          </p>
        )}
      </div>

      <Link
        href={href || `/product/${item.slug}`}
        className={`w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 px-3 rounded-xl font-semibold transition-all duration-200 ${
          isAvailable
            ? "bg-primary hover:bg-primary/90 active:scale-95 text-white shadow-md hover:shadow-lg"
            : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
        }`}
      >
        <ShoppingBasket className={`size-4 sm:size-5 ${!isAvailable && "opacity-60"}`} />
        <span className="text-xs sm:text-sm">
          {isAvailable ? "افزودن به سبد خرید" : "محصول ناموجود"}
        </span>
      </Link>
    </div>
  );
}
