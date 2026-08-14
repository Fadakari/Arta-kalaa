"use client";

import Image from "next/image";
import { Feature } from "@/types";
import { useState } from "react";

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

export default function FeatureCard({ feature, index }: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative flex items-start gap-4 p-6 rounded-2xl bg-white shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden border border-gray-100 hover:border-blue-200"
      style={{
        animation: `fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s both`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* افکت گرادیانت پس‌زمینه */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* دایره نورانی */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 via-blue-500/20 to-blue-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* آیکون */}
      <div className="relative flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl rotate-6 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500" />
        <div className="absolute inset-0 bg-blue-500/0 rounded-2xl group-hover:bg-blue-500/10 transition-all duration-500 -rotate-3" />
        <Image
          width={200}
          height={200}
          src={feature.img}
          alt={feature.title}
          className="relative w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-contain drop-shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-500"
        />
      </div>
      
      {/* متن */}
      <div className="relative flex-1">
        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-all duration-300">
          {feature.title}
        </h3>
        
        <p className={`text-gray-500 text-sm leading-relaxed transition-all duration-300 ${
          isHovered ? 'text-gray-700' : ''
        }`}>
          {feature.desc}
        </p>
        
        {/* خط زیرین متحرک */}
        <div className="absolute -bottom-2 right-0 h-0.5 bg-gradient-to-l from-blue-500 to-transparent w-0 group-hover:w-full transition-all duration-500" />
      </div>

      {/* آیکون فلش در هاور - حالا در سمت چپ */}
      <div className="absolute left-4 bottom-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0">
        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </div>

      {/* شمارنده اندیس - حالا در سمت چپ */}
      <div className="absolute top-3 left-3 text-xs font-bold text-gray-200 group-hover:text-blue-200 transition-colors">
        {String(index + 1).padStart(2, '0')}
      </div>
    </div>
  );
}