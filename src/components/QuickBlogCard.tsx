"use client";

import Article from "@/types/blog";
import Link from "next/link";
import { useState } from "react";
import { fixImageUrl } from "@/lib/urls";

function QuickBlogCard({ item }: { item: Article }) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = fixImageUrl(item.thumbnail);

  return (
    <article className="relative w-full h-full">
      <Link
        href={`/article/${item.slug}`}
        className="block relative w-full h-72 overflow-hidden rounded-xl border border-slate-200/80 group"
      >
        {!imgError && imageUrl ? (
          <img
            src={imageUrl}
            alt={`تصویر مقاله ${item.title}`}
            className="w-full h-full object-cover bg-slate-50 group-hover:brightness-95 transition-all duration-300"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100">
            <div className="text-center">
              <span className="text-4xl mb-2 block">📰</span>
              <p className="text-slate-500 text-sm px-4">بدون تصویر</p>
            </div>
          </div>
        )}
        <div className="w-full bg-white/90 text-slate-900 absolute z-10 bottom-0 py-2.5 px-3 text-base font-semibold line-clamp-2 border-t border-slate-100">
          {item.title}
        </div>
      </Link>
    </article>
  );
}

export default QuickBlogCard;
