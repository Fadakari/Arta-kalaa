// components/Brand.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

interface BrandProps {
  item: {
    id?: number;
    name: string;
    image?: string;
    link?: string;
  };
}

export default function Brand({ item }: BrandProps) {
  const BrandContent = () => {
    // بررسی آیا تصویر از placehold.co هست یا خیر
    const isPlaceholder = item.image?.includes('placehold.co');
    
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4 transition-all duration-300 hover:scale-105">
        <div className="relative w-32 h-32 mb-2">
          {item.image ? (
            isPlaceholder ? (
              // استفاده از img معمولی برای placeholderهای خارجی
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.image}
                alt={item.name}
                title={item.name}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            ) : (
              <Image
                src={item.image}
                alt={item.name}
                title={item.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 128px, 128px"
                loading="lazy"
              />
            )
          ) : (
            <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-gray-400 text-lg font-bold">
                {item.name.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <span className="text-gray-700 text-sm font-medium text-center">
          {item.name}
        </span>
      </div>
    );
  };

  if (item.link) {
    return <Link href={item.link}>{BrandContent()}</Link>;
  }

  return BrandContent();
}