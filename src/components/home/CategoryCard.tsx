"use client";

import Image from "next/image";
import Link from "next/link";
import { HiOutlineCube, HiChevronDoubleLeft } from "react-icons/hi";
import { Category } from "@/types";
import { useState } from "react";
import { fixImageUrl } from "@/lib/urls";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = fixImageUrl(category.icon);
  
  return (
    <Link
      href={`/products?category_id=${category.id}`}
      className="group relative flex items-center gap-8 p-7 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-2xl hover:border-gray-200 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
      aria-label={`دسته‌بندی ${category.name}`}
    >
      {/* پس‌زمینه سفید */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-gray-50 to-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 scale-0 group-hover:scale-100" />
      <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-gradient-to-tl from-gray-50 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 scale-0 group-hover:scale-100" />
      
      {/* آیکون */}
      <div className="relative">
        {!imgError && imageUrl ? (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl rotate-6 scale-90 group-hover:rotate-12 group-hover:scale-100 transition-all duration-500" />
            <Image
              src={imageUrl}
              alt={`${category.name} دسته‌بندی`}
              width={130}
              height={130}
              loading="lazy"
              className="relative object-contain w-28 h-28 lg:w-32 lg:h-32 transition-transform duration-500 group-hover:scale-110"
              onError={() => setImgError(true)}
              unoptimized={true}
            />
          </div>
        ) : (
          <HiOutlineCube className="w-28 h-28 lg:w-32 lg:h-32 text-gray-300 group-hover:text-gray-500 transition-colors duration-300" />
        )}
      </div>
      
      {/* جزئیات */}
      <div className="relative flex flex-col items-center gap-4">
        <p className="font-bold text-lg text-gray-700 group-hover:text-gray-900 transition-colors duration-300 whitespace-nowrap">
          {category.name}
        </p>
        <span className="inline-flex items-center gap-2 px-5 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium text-sm text-gray-600 group-hover:bg-gray-800 group-hover:text-white group-hover:border-gray-800 transition-all duration-300">
          مشاهده
          <HiChevronDoubleLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
        </span>
      </div>
    </Link>
  );
}