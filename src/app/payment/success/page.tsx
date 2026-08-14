// app/payment/success/page.tsx
import { FaCircleCheck } from "react-icons/fa6";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-gray-50">
      <FaCircleCheck className="text-green-500 size-24 mb-6 drop-shadow-lg" />

      <h1 className="text-2xl font-semibold text-gray-800 mb-2">
        پرداخت با موفقیت انجام شد!
      </h1>

      <p className="text-gray-600 mb-6">
        سفارش شما با موفقیت ثبت شد. جزئیات سفارش برای شما ارسال شده است.
      </p>

      {/* اگر شماره سفارش دارید می‌تونید اینجا نمایش بدید */}
      {/* <p className="text-sm text-gray-500 mb-4">شماره سفارش: 123456</p> */}

      <div className="flex gap-4">
        <Link
          href="/profile/orders"
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition"
        >
          مشاهده سفارش
        </Link>
        <Link
          href="/"
          className="border border-gray-300 hover:bg-gray-100 text-gray-700 px-6 py-2 rounded-lg transition"
        >
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  );
}
