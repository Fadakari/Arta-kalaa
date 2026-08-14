"use client";

import { FormEvent, useState } from "react";
import { useCart } from "@/context/CartContextProvider";
import { useUser } from "@/context/UserContext";
import { addToast } from "@heroui/toast";
import {
  createDiscountedOrder,
  createNormalOrder,
  goToGateways,
} from "@/services/shopActions";
import Link from "next/link";
import { convertNumberToPersian } from "@/utils/converNumbers";

interface FormData {
  discount_code: string;
}

const CreateOrder = () => {
  const { user } = useUser();
  const { cart } = useCart();
  const [formData, setFormData] = useState<FormData>({ discount_code: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [checkingDiscount, setCheckingDiscount] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleCheckDiscount = async () => {
    if (!formData.discount_code) {
      setErrors({ ...errors, discount_code: "کد تخفیف خالی است" });
      return;
    }
    setCheckingDiscount(true);
    try {
      const res = await fetch("/internal-api/shop/discount/check/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: formData.discount_code }),
      });
      const result = await res.json();
      if (!res.ok || !result?.data?.discount_percentage) {
        throw new Error(result.message || "کد تخفیف معتبر نیست.");
      }
      const discountData = result.data;
      const calculatedDiscount = Math.floor(
        (cart.total_price * discountData.discount_percentage) / 100
      );
      setDiscountAmount(calculatedDiscount);
      setDiscountApplied(true);
      addToast({
        title: "کد تخفیف اعمال شد",
        description: `٪${discountData.discount_percentage} تخفیف معادل ${calculatedDiscount.toLocaleString(
          "fa-IR"
        )} تومان از سبد خرید کسر شد.`,
        color: "success",
      });
    } catch (error: any) {
      setDiscountApplied(false);
      setDiscountAmount(0);
      setErrors({ ...errors, discount_code: error.message });
    } finally {
      setCheckingDiscount(false);
    }
  };

  const removeDiscount = () => {
    setDiscountApplied(false);
    setDiscountAmount(0);
    setFormData({ discount_code: "" });
    setErrors({ ...errors, discount_code: "" });
    addToast({
      title: "کد تخفیف حذف شد",
      description: "کد تخفیف از سفارش شما حذف شد.",
      color: "warning",
    });
  };

  const validateFields = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!cart || cart.total_items === 0) {
      addToast({
        title: "سبد خرید خالی است",
        description: "لطفاً ابتدا محصولی به سبد خرید اضافه کنید.",
        color: "warning",
      });
      return false;
    }
    if (!user) {
      addToast({
        title: "خطا",
        description: "اطلاعات کاربری یافت نشد.",
        color: "danger",
      });
      return false;
    }
    if (!user.identity.first_name) newErrors.first_name = "نام الزامی است";
    if (!user.identity.last_name)
      newErrors.last_name = "نام خانوادگی الزامی است";
    if (!user.identity.phone_number)
      newErrors.phone_number = "شماره تلفن الزامی است";
    if (!user.identity.province) newErrors.province = "استان الزامی است";
    if (!user.identity.city) newErrors.city = "شهر الزامی است";
    if (!user.identity.address) newErrors.address = "آدرس الزامی است";
    if (!user.identity.postal_code)
      newErrors.postal_code = "کد پستی الزامی است";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createOrder = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateFields()) return;

    setIsSubmitting(true);

    const discountedItems = cart.items.filter((item) => item.final_price);
    const normalItems = cart.items.filter((item) => !item.final_price);

    const basePayload = {
      discount_code: formData.discount_code || "",
      name_receiver: `${user?.identity.first_name} ${user?.identity.last_name}`,
      receiver_phone: user?.identity.phone_number,
      receiver_province: user?.identity.province,
      receiver_city: user?.identity.city,
      address_receiver: user?.identity.address,
      receiver_postal_code: user?.identity.postal_code,
    };

    const requests = [];
    if (discountedItems.length > 0)
      requests.push(
        createDiscountedOrder({ ...basePayload, cart_items: discountedItems })
      );
    if (normalItems.length > 0)
      requests.push(
        createNormalOrder({ ...basePayload, cart_items: normalItems })
      );

    const responses = await Promise.all(requests);
    setIsSubmitting(false);

    const allSuccessful = responses.every((res) => res && res.success);
    if (allSuccessful) {
      const orderId = responses[0]?.data?.id;
      await goToGateways(orderId);
    } else {
      const failed = responses.find((res) => !res.success);
      addToast({
        title: "خطا در ثبت سفارش",
        description: failed?.message || "مشکلی پیش آمد، دوباره تلاش کنید.",
        color: "danger",
      });
    }
  };

  return (
    <>
      <form
        onSubmit={createOrder}
        className="grid md:grid-cols-5 gap-6 p-5 rounded max-w-7xl mx-auto"
      >
        <div className="col-span-3 flex flex-col gap-4">
          <div className="p-4 bg-zinc-100 rounded-md shadow-sm">
            <p className="text-gray-700 text-sm">
              سفارش شما با استفاده از اطلاعات پروفایل ثبت می‌شود. لطفا قبل از*
              ثبت نهایی، اطلاعات را بررسی کنید.
            </p>
          </div>

          <div className="p-4 bg-white rounded-md shadow-sm mt-2 space-y-2">
            <label className="block text-sm font-medium">
              کد تخفیف (اختیاری)
            </label>
            <div className="flex gap-2 items-center">
              <input
                name="discount_code"
                value={formData.discount_code}
                onChange={handleChange}
                className={`flex-1 border rounded px-3 py-2 transition ${
                  errors.discount_code
                    ? "border-red-500 animate-shake"
                    : "border-gray-300"
                }`}
                readOnly={discountApplied}
                placeholder="اگر کد تخفیف دارید وارد کنید"
              />

              <button
                type="button"
                onClick={discountApplied ? removeDiscount : handleCheckDiscount}
                className={`transition disabled:pointer-events-none rounded-md ${
                  discountApplied
                    ? "bg-danger/10 border border-danger/40 text-danger/80 px-4 py-2"
                    : "btn-primary !px-4 py-2"
                }`}
                disabled={checkingDiscount}
              >
                {discountApplied
                  ? "حذف کد"
                  : checkingDiscount
                    ? "در حال بررسی..."
                    : "بررسی کد"}
              </button>
            </div>
            {errors.discount_code && (
              <p className="text-red-500 text-xs mt-1">
                {errors.discount_code}
              </p>
            )}
          </div>
        </div>

        <div className="col-span-3 md:col-span-2 shadow-lg rounded-lg p-6 space-y-5 border border-zinc-200 sticky top-5 bg-white">
          <h2 className="font-semibold text-lg border-b pb-2 mb-2">
            اطلاعات گیرنده
          </h2>
          <div className="space-y-2">
            {[
              {
                key: "first_name",
                label: "نام",
                value: user?.identity?.first_name,
              },
              {
                key: "last_name",
                label: "نام خانوادگی",
                value: user?.identity?.last_name,
              },
              {
                key: "phone_number",
                label: "شماره",
                value: user?.identity?.phone_number
                  ? convertNumberToPersian(user?.identity?.phone_number)
                  : user?.identity?.phone_number,
              },
              {
                key: "province",
                label: "استان",
                value: user?.identity?.province,
              },
              { key: "city", label: "شهر", value: user?.identity?.city },
              { key: "address", label: "آدرس", value: user?.identity?.address },
              {
                key: "postal_code",
                label: "کد پستی",
                value: user?.identity?.postal_code,
              },
            ].map((field) => (
              <p
                key={field.key}
                className={`${errors[field.key] ? "text-red-500 animate-shake" : ""}`}
              >
                <span className="font-medium">{field.label}:</span>{" "}
                {field.value || "نیاز به تکمیل"}
              </p>
            ))}
            <Link
              href={`/profile/personal-info?redirect=${encodeURIComponent("/profile/checkout")}`}
              className="bg-primary text-white px-4 py-2 hover:underline !rounded-full mt-2"
            >
              ویرایش اطلاعات
            </Link>
          </div>

          <hr className="my-3" />
          <div className="space-y-2">
            <div className="flex justify-between">
              <p>
                قیمت کالاها ({cart.total_items.toLocaleString("fa-IR")} کالا)
              </p>
              <p className="font-semibold">
                {cart.total_price.toLocaleString("fa-IR")} تومان
              </p>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-700">
                <p>تخفیف</p>
                <p className="font-semibold">
                  -{discountAmount.toLocaleString("fa-IR")} تومان
                </p>
              </div>
            )}
            <div className="flex justify-between">
              <p>هزینه ارسال</p>
              <p className="font-semibold">
                {cart.total_delivery === 0 ? (
                  <span className="text-red-500">رایگان</span>
                ) : (
                  `${cart.total_delivery.toLocaleString("fa-IR")} تومان`
                )}
              </p>
            </div>
            <hr className="my-3" />
            <div className="flex justify-between text-lg font-semibold">
              <p>مبلغ قابل پرداخت</p>
              <p>{cart.final_price.toLocaleString("fa-IR")} تومان</p>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full mt-4 font-semibold py-3"
            disabled={isSubmitting || Object.keys(errors).length > 0}
          >
            {isSubmitting ? "در حال ثبت..." : "ثبت نهایی"}
          </button>
        </div>
      </form>
    </>
  );
};

export default CreateOrder;
