"use client";

import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa6";
import { formatShamsiDateString } from "@/utils/formatShamsiDateString";
const statusLabels: Record<string, { fa: string; color: string }> = {
  pending: { fa: "در انتظار پرداخت", color: "bg-[#fef3c7] text-[#854d0e]" },
  delivered: { fa: "تحویل شده", color: "bg-[#dcfce7] text-[#166534]" },
  cancelled: { fa: "لغو شده", color: "bg-[#fee2e2] text-[#991b1b]" },
  shipped: { fa: "ارسال شده", color: "bg-[#dbeafe] text-[#1e40af]" },
  paid: { fa: "پرداخت شده", color: "bg-[#dcfce7] text-[#166534]" }, // اضافه شد
};

export default function Order({ order }: { order: any }) {
  const pdfRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;
    const canvas = await html2canvas(pdfRef.current, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    const pdf = new jsPDF("p", "mm", "a4");

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`order-${order.order_number}.pdf`);
  };

  const label = statusLabels[order.status] || {
    fa: order.status,
    color: "bg-gray-100 text-gray-800",
  };
  return (
    <div className="p-4 space-y-6 font-dana">
      <Link
        href={"/profile/orders"}
        className="flex items-center text-zinc-800 text-lg"
      >
        <FaChevronRight className="size-5" />
        <span className="pt-0.5">برگشت</span>
      </Link>
      <div className="flex justify-between items-center print:hidden">
        <h1 className="text-3xl font-bold text-black">
          جزئیات سفارش: {order.order_number}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={handleDownloadPDF}
            className="btn-primary text-white py-1 px-4 rounded-lg text-sm"
          >
            دانلود PDF
          </button>
          <button
            onClick={handlePrint}
            className="bg-gray-700 text-white py-1 px-4 rounded-lg text-sm"
          >
            پرینت
          </button>
        </div>
      </div>

      <div
        id="print-area"
        ref={pdfRef}
        className="bg-white p-4 rounded-b-lg shadow-md space-y-4 print:shadow-none print:border-none"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg">
          <div>شماره سفارش: {order.order_number}</div>
          <div>
            وضعیت:
            <span
              className={`px-2 py-1 text-sm rounded-full font-pelak ${label.color}`}
            >
              {label.fa}
            </span>
          </div>
          <div>تاریخ ثبت: {formatShamsiDateString(order.order_date)}</div>
          <div>مبلغ کل: {order.total_amount.toLocaleString()} تومان</div>
          <div>نام گیرنده: {order.receiver_name}</div>
          <div>شماره موبایل: {order.receiver_phone}</div>
          <div>شهر: {order.receiver_city}</div>
          <div>آدرس کامل: {order.receiver_address}</div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold mt-4 border-b pb-2">
            محصولات سفارش
          </h2>
          {order.items.map((item: any, index: number) => (
            <div
              key={index}
              className="flex items-center gap-4 border rounded-md p-3 shadow-sm print:shadow-none"
            >
              <div className="flex flex-col gap-1 text-sm">
                <div>نام محصول: {item.product_name}</div>
                <div>تعداد: {item.quantity}</div>
                <div>قیمت واحد: {item.unit_price.toLocaleString()} تومان</div>
                <div className="font-semibold">
                  قیمت کل: {item.total_price.toLocaleString()} تومان
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
