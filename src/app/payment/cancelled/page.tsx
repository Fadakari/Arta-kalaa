// app/payment/cancelled/page.tsx
import { FaCircleXmark } from "react-icons/fa6";
import Link from "next/link";

export default function Cancelled() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-gray-50">
      <FaCircleXmark className="text-yellow-500 size-24 mb-6 drop-shadow-lg" />

      <h1 className="text-2xl font-semibold text-gray-800 mb-2">
        پرداخت لغو شد
      </h1>

      <p className="text-gray-600 mb-6">
        پرداخت شما توسط کاربر یا بانک لغو شده است. در صورت نیاز می‌توانید دوباره
        پرداخت را انجام دهید.
      </p>

      <div className="flex gap-4">
        <Link
          href="/profile/cart"
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg transition"
        >
          بازگشت به سبد خرید
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
