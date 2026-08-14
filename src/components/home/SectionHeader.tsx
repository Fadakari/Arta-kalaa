import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  highlight?: string;
  linkHref?: string;
  linkText?: string;
  className?: string;
}

export default function SectionHeader({
  title,
  highlight,
  linkHref,
  linkText = "مشاهده همه",
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`mb-6 rounded-xl p-4 flex items-center justify-between flex-wrap ${className}`}>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Image
            src="/square.png"
            alt=""
            width={40}
            height={40}
            className="w-10 h-10 object-contain"
          />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
        </div>
        <h2 className="text-lg font-bold flex items-center gap-1">
          {highlight && (
            <span className="text-blue-500 bg-blue-50 px-2 py-0.5 rounded-lg">
              {highlight}
            </span>
          )}
          {title}
        </h2>
      </div>
      
      {linkHref && (
        <Link
          href={linkHref}
          className="group relative flex items-center gap-1 font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          {linkText}
          <ChevronLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
          <span className="absolute -bottom-1 right-0 h-0.5 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full rounded-full" />
        </Link>
      )}
    </div>
  );
}