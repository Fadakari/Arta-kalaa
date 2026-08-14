import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function EmptyCart({ onClose }: any) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center size-full mb-2">
      <ShoppingCart className="w-16 h-16 text-gray-400 mb-4" />
      <h2 className="text-2xl font-semibold mb-2">سبد خرید شما خالی است</h2>
      <p className="text-gray-500 mb-6">
        محصولی به سبد خرید خود اضافه نکرده‌اید.
      </p>
      <Link
        href="/products"
        onClick={onClose}
        className="btn-primary px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl transition"
      >
        رفتن به فروشگاه
      </Link>
    </div>
  );
}
