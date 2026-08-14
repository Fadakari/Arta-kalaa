"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { FaSlidersH, FaSortAmountUp } from "react-icons/fa";
import FilterBox from "./FilterBox";
import { useStartNavigation } from "@/context/NavigationProvider";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  useDisclosure,
} from "@heroui/react";
import { HiXMark } from "react-icons/hi2";

function SortBox() {
  const sortOptions = [
    { label: "جدیدترین", value: "newest" },
    { label: "محبوب ترین", value: "popularity" },
    { label: "ارزان ترین", value: "price_asc" },
    { label: "گران ترین", value: "price_desc" },
  ];
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const startNavigation = useStartNavigation();

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", value);
    startNavigation();
    router.push(`${pathname}?${params.toString()}`);
  };

  const currentSort = searchParams.get("sort") || "newest";

  return (
    <>
      {/* دسکتاپ: نمایش افقی */}
      <div className="hidden items-center lg:flex">
        <p className="text-zinc-400 font-light select-none">
          مرتب‌سازی بر اساس:
        </p>
        <div className="flex items-center mr-2">
          {sortOptions.map((option, i) => (
            <button
              key={i}
              className={`text-zinc-500 font-light text-sm px-3 py-1 rounded-full transition-colors ${
                currentSort === option.value
                  ? "bg-primary hover:bg-primary-500 !text-white cursor-default"
                  : "hover:text-zinc-600"
              }`}
              onClick={() => handleSortChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* موبایل: دو ستونه */}
      <div className="lg:hidden space-y-3">
        {/* ردیف اول: دکمه فیلتر و سورت باکس */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpen}
            className="btn-primary flex-1 font-semibold relative text-center py-2.5 px-4 bg-blue-600 text-white rounded-lg"
          >
            فیلتر تخصصی
            <FaSlidersH className="absolute top-3 right-3 size-5" />
          </button>
          
          <div className="relative flex-1">
            <select
              name="sort"
              id="sort"
              value={currentSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="border-2 outline-none p-2.5 appearance-none pr-10 border-zinc-200 text-zinc-600 bg-white rounded-lg w-full"
            >
              {sortOptions.map((opt, i) => (
                <option key={i} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <FaSortAmountUp className="size-5 absolute top-3 right-3 text-zinc-600 pointer-events-none" />
          </div>
        </div>

        {/* ردیف دوم: دکمه‌های مرتب‌سازی سریع (دو ستونه) */}
        <div className="grid grid-cols-2 gap-2">
          {sortOptions.map((option, i) => (
            <button
              key={i}
              onClick={() => handleSortChange(option.value)}
              className={`text-center text-sm px-3 py-2 rounded-lg transition-all duration-200 ${
                currentSort === option.value
                  ? "bg-blue-600 text-white font-medium shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Drawer فیلتر */}
      <Drawer
        hideCloseButton
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="bg-[#f3f3f3] w-full transition-transform duration-300 ease-in-out"
        radius="sm"
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2 py-2">
                  <div className="flex items-center gap-3">
                    <p>فیلتر نتایج</p>
                  </div>
                  <button type="button" onClick={onClose}>
                    <HiXMark className="size-8" />
                  </button>
                </div>
              </DrawerHeader>
              <DrawerBody className="relative overflow-hidden px-0 w-full">
                <FilterBox isShow />
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SortBox;