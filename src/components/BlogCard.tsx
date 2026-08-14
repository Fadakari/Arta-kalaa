"use client";
import Article from "@/types/blog";
import Image from "next/image";
import Link from "next/link";
import { CiImageOff } from "react-icons/ci";
import { IoTimeOutline } from "react-icons/io5";
import { TfiArrowTopLeft } from "react-icons/tfi";
import { SiGoogleappsscript } from "react-icons/si";
function BlogCard({ item }: { item: Article }) {
  return (
    <article
      key={item.id}
      className="bg-white  rounded-3xl border border-zinc-300 hover:-translate-y-3 transition-all ease-soft-spring duration-300 group/card w-full h-full flex flex-col overflow-hidden "
    >
      <Link
        href={`/article/${item.slug}`}
        key={item.id}
        title={item.title}
        className="size-full flex relative"
      >
        {item.thumbnail ? (
          <Image
            width={360}
            height={220}
            src={item.thumbnail}
            alt={item.title}
            className="w-full h-56 object-cover rounded-t-lg group-hover/card:brightness-110 transition-all ease-linear duration-500"
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
          />
        ) : (
          <div className="w-full h-56 bg-zinc-200 rounded-md flex items-center justify-center">
            <CiImageOff className="size-15" />
          </div>
        )}
        <div className="absolute top-3 left-3 bg-white px-5 py-1 rounded-lg shadow font-medium font-dana">
          {item.created_at_relative}
        </div>
      </Link>
      <div className="p-3.5 sm:p-5">
        <h3 className="text-2xl font-semibold mt-2   line-clamp-2">
          {item.title}
        </h3>
        <p className="w-full line-clamp-1">{item.introduction}</p>
        <div className="flex items-center justify-around flex-wrap gap-5 text-zinc-600 mt-5 text-sm">
          <div className="flex flex-col items-center font-medium">
            <IoTimeOutline className="size-7" />
            {item.reading_time}
          </div>
          <div className="flex flex-col items-center font-medium">
            <SiGoogleappsscript className="size-7" />
            {item.category.title}
          </div>
        </div>
        <hr className=" text-zinc-300 my-4" />
        <Link
          href={`/article/${item.slug}`}
          className="font-bold text-lg flex items-center gap-1 justify-center group/link hover:underline
          "
        >
          جزییات بیشتر
          <TfiArrowTopLeft className="size-6 group-hover/link:-translate-y-1 group-hover/link:-translate-x-1 transition-transform ease-soft-spring duration-300" />
        </Link>
      </div>
    </article>
  );
}
export function BlogCardSkeleton() {
  return (
    <article className="bg-white rounded-3xl border border-zinc-300 w-full h-full flex flex-col overflow-hidden animate-pulse">
      <div className="w-full h-56 bg-zinc-300 rounded-t-lg" />
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="h-8 bg-zinc-300 rounded-md w-3/4" />
        <div className="h-5 bg-zinc-300 rounded-md w-full" />
        <div className="flex items-center justify-around flex-wrap gap-5 mt-5">
          <div className="h-6 w-16 bg-zinc-300 rounded-md" />
          <div className="h-6 w-20 bg-zinc-300 rounded-md" />
        </div>
        <hr className="border-zinc-300 my-4" />
        <div className="h-7 bg-zinc-300 rounded-md w-32 mx-auto" />
      </div>
    </article>
  );
}

export default BlogCard;
