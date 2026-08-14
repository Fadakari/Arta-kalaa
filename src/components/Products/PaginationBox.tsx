"use client";

import type { PaginationItemRenderProps } from "@heroui/react";

import React from "react";
import { cn, Pagination, PaginationItemType } from "@heroui/react";
import { GoChevronLeft } from "react-icons/go";
import { useRouter } from "next/navigation";
import { useStartNavigation } from "@/context/NavigationProvider";

export default function PaginationBox({
  page,
  count,
  searchParams,
  href,
  total,
}: {
  page?: number;
  count?: number;
  searchParams: any;
  isShow?: boolean;
  href?: string;
  total?: number;
}) {
  const router = useRouter();
  const startNavigation = useStartNavigation();
  const renderItem = ({
    ref,
    key,
    value,
    isActive,
    onNext,
    onPrevious,
    setPage,
    className,
  }: PaginationItemRenderProps) => {
    if (value === PaginationItemType.NEXT) {
      return (
        <button
          key={key}
          className={cn(
            className,
            "hover:bg-default-200/50 rounded-xs min-w-8 w-8 h-8"
          )}
          onClick={onNext}
        >
          <GoChevronLeft />
        </button>
      );
    }

    if (value === PaginationItemType.PREV) {
      return (
        <button
          key={key}
          className={cn(
            className,
            "hover:bg-default-200/50 rounded-xs min-w-8 w-8 h-8"
          )}
          onClick={onPrevious}
        >
          <GoChevronLeft className="rotate-180" />
        </button>
      );
    }

    if (value === PaginationItemType.DOTS) {
      return (
        <button
          key={key}
          className={`${className} !text-sm hover:bg-default-200/50 `}
        >
          ...
        </button>
      );
    }

    return (
      <button
        key={key}
        ref={ref}
        className={cn(
          `${className} hover:bg-default-200/50 text-sm rounded-xs`,
          isActive &&
            "text-white bg-primary hover:bg-primary/80 active:bg-primary-500 font-bold rounded-xs"
        )}
        onClick={() => setPage(value)}
      >
        {value}
      </button>
    );
  };
  return (
    <Pagination
      dir="rtl"
      disableCursorAnimation
      showControls
      className="gap-2 font-dana"
      initialPage={page || 1}
      radius="full"
      renderItem={renderItem}
      total={total ? total : count ? Math.ceil(count / 20) : 1}
      boundaries={3}
      variant="light"
      onChange={(page) => {
        const params = total
          ? ""
          : new URLSearchParams(searchParams).toString();
        startNavigation();
        router.push(`/${href ? href : "products"}/page/${page}?${params}`);
      }}
    />
  );
}
