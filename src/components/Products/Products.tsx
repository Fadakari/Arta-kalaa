"use client";
import React from "react";
import Card from "./Card";
import PaginationBox from "./PaginationBox";
import ProductType from "@/types/product";
import { convertNumberToPersian } from "@/utils/converNumbers";

function Products({
  searchParams,
  products,
  pagination = { count: 0, page: 1 },
  href,
}: {
  searchParams: any;
  products: ProductType[];
  pagination?: { count: number; page: number };
  href?: string;
}) {
  return (
    <>
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3.5 items-stretch">
        {products.length > 0 ? (
          products.map((product) => <Card key={product.id} item={product} />)
        ) : (
          <div className="col-span-4 text-zinc-500 bg-white shadow rounded-xs p-5">
            <p className="px-4 py-2 rounded-xs bg-primary/20 w-full border border-primary/40 text-primary-800 text-base my-4">
              جستجو برای این ترکیب از فیلترها با هیچ کالایی هم‌خوانی نداشت.
            </p>
            <p>تلاش کنید</p>
            <p>- تعدادی از فیلتر ها را حذف کنید.</p>
            <p>- در جستجو از عبارت‌های متداول‌تر استفاده کنید.</p>
          </div>
        )}
      </div>

      <div
        className="bg-white shadow p-3 rounded-sm flex justify-between items-center"
        dir="rtl"
      >
        <PaginationBox
          href={href}
          searchParams={searchParams}
          count={pagination?.count}
          page={Number(pagination.page) || 1}
        />
        <div>
          <span>مجموع نتایج : </span>
          <span>{convertNumberToPersian(pagination.count)}</span>
        </div>
      </div>
    </>
  );
}

export default Products;
