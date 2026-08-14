"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { BlogCategoryNode } from "@/types/categories";
import Link from "next/link";

interface CategoryTreeProps {
  categories: BlogCategoryNode[];
  isMobile?: boolean;
}

export default function CategoryTree({
  categories,
  isMobile = false,
}: CategoryTreeProps) {
  const [showModal, setShowModal] = useState(false);

  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary w-full my-5"
        >
          نمایش دسته‌بندی‌ها
        </button>

        <AnimatePresence>
          {showModal && (
            <>
              <motion.div
                className="fixed inset-0 bg-black/40 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowModal(false)}
              />

              <motion.div
                className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 z-50 max-h-[80vh] overflow-y-auto shadow-xl transition-all ease-soft-spring"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">دسته‌بندی‌ها</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-sm text-zinc-500 hover:text-zinc-800"
                  >
                    بستن
                  </button>
                </div>
                <div className="space-y-2 py-5">
                  {categories.map((category) => (
                    <CategoryItem key={category.id} category={category} />
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <div className="space-y-2">
      {categories.map((category) => (
        <CategoryItem key={category.id} category={category} />
      ))}
    </div>
  );
}

function CategoryItem({ category }: { category: BlogCategoryNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = category.children.length > 0;
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  return (
    <div className="border border-zinc-200 rounded-md bg-zinc-50 overflow-hidden">
      {hasChildren ? (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between px-3 py-4 text-sm text-zinc-700 font-medium hover:bg-zinc-100 transition-colors"
        >
          <span>{category.title}</span>
          <ChevronLeft
            className={`h-4 w-4 text-zinc-500 transition-transform duration-200 ${
              isOpen ? "-rotate-90" : ""
            }`}
          />
        </button>
      ) : (
        <Link
          onClick={() => setIsOpen(false)}
          href={`/articles?category=${category.slug}`}
          className="block px-3 py-3.5 text-sm text-zinc-700 font-medium hover:bg-zinc-100 transition-colors"
        >
          {category.title}
        </Link>
      )}

      <motion.div
        animate={{ height }}
        transition={{ duration: 0.3, ease: "linear" }}
        style={{ overflow: "auto" }}
      >
        <div ref={contentRef} className="px-4 border-t border-zinc-200">
          {hasChildren && (
            <div className="flex flex-col gap-3 overflow-auto py-2">
              {category.children.map((child) => (
                <CategoryItem key={child.id} category={child} />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
