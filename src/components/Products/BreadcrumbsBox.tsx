import Link from "next/link";
import { ReactNode } from "react";

type BreadcrumbItem = {
  label: string;
  href?: string; // اگر نباشد یعنی مرحله‌ی فعلی است و لینک نیست
};

type BreadcrumbsBoxProps = {
  title?: string;
  items: BreadcrumbItem[];
  separator?: ReactNode;
  className?: string;
};

function BreadcrumbsBox({
  title,
  items,
  separator = "/",
  className = "",
}: BreadcrumbsBoxProps) {
  if (!items.length) return null;

  return (
    <div className={`pb-16 ${className}`}>
      <div className="py-5 w-full shadow absolute right-0 bg-white">
        <div className="container mx-auto flex items-center gap-3">
          {title && <strong className="text-base">{title}</strong>}
          <div className="text-sm text-zinc-500 flex items-center gap-1 flex-wrap">
            {items.map((item, idx) => (
              <span key={idx} className="flex items-center gap-1">
                {idx > 0 && <span>{separator}</span>}
                {item.href ? (
                  <Link
                    href={item.href}
                    className="hover:text-zinc-700 transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-zinc-700 font-medium">
                    {item.label}
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BreadcrumbsBox;
