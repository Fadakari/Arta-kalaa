"use client";

import { CartFormat, useCart } from "@/context/CartContextProvider";
import ProductButton from "./ProtectButton";
import { FaBasketShopping } from "react-icons/fa6";
import { HiXMark } from "react-icons/hi2";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import EmptyCart from "./EmptyCart";
import { CiImageOff } from "react-icons/ci";

export default function CartDrawer({ cart }: { cart: CartFormat }) {
  const [isOpen, setIsOpen] = useState(false);
  const { removeFromCart, incrementQuantity, decrementQuantity, loading } = useCart();

  return (
    <div className="relative inline-block group mt-1">
      <button
        onClick={() => setIsOpen(true)}
        className="relative group-hover:bg-primary/50 group-active:bg-primary/50 p-2 rounded-lg"
        title="سبد خرید"
        aria-label="cart"
      >
        <FaBasketShopping className="size-8 text-zinc-700" />
        {cart.items.length > 0 && (
          <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center pt-0.5">
            {cart.items.length.toLocaleString("fa-IR")}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

          <div className="relative w-full max-w-md bg-zinc-100 shadow-2xl h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between bg-primary-600 text-white px-6 py-3">
              <p className="text-2xl font-bold">سبد خرید</p>
              <button onClick={() => setIsOpen(false)}>
                <HiXMark className="size-8" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-2 py-4 space-y-4 relative">
              {loading && (
                <div className="absolute inset-0 bg-zinc-100/80 flex justify-center items-center z-10">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {cart.items.length > 0 ? (
                cart.items.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 p-2 rounded-lg">
                    <div className="relative bg-white rounded-xl shadow-md">
                      {item.product.cover_image ? (
                        <Image
                          src={item.product.cover_image}
                          alt={item.product.name}
                          width={100}
                          height={100}
                          className="w-40 h-24 object-contain rounded-lg overflow-hidden"
                        />
                      ) : (
                        <div className="w-40 h-24 bg-zinc-200 rounded-md flex items-center justify-center">
                          <CiImageOff className="size-14" />
                        </div>
                      )}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="absolute -top-1 -right-2 bg-white border border-zinc-400 text-zinc-600 p-1 rounded-full"
                      >
                        <HiXMark className="size-4" />
                      </button>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex items-center rounded-b-xl overflow-hidden bg-white">
                          <button
                            onClick={() => decrementQuantity(item.id)}
                            className="px-3 py-2 border-r border-zinc-300 hover:bg-zinc-50 active:bg-zinc-100"
                          >
                            -
                          </button>
                          <span className="px-4">{item.quantity}</span>
                          <button
                            onClick={() => incrementQuantity(item.id)}
                            className="px-3 py-2 border-l border-zinc-300 hover:bg-zinc-50 active:bg-zinc-100"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col w-full gap-2 pr-1">
                      <p className="font-semibold text-zinc-700 text-lg">{item.product.name}</p>
                      <div className="flex gap-2 items-center flex-wrap">
                        {item.color_variant && (
                          <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5 border border-zinc-200">
                            <div
                              className="w-3 h-3 rounded-full border border-zinc-300"
                              style={{ backgroundColor: `#${item.color_variant.color_code}` }}
                            />
                            <span className="text-sm text-zinc-800">{item.color_variant.color_name}</span>
                          </div>
                        )}
                        {item.material_variant && (
                          <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5 border border-zinc-200">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-zinc-400 to-zinc-500" />
                            <span className="text-sm text-zinc-800">{item.material_variant.material_name}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p><span className="text-zinc-600 text-sm">قیمت واحد:</span> {item.unit_price.toLocaleString("fa-IR")} تومان</p>
                        <p><span className="text-zinc-600 text-sm">قیمت کل:</span> {item.total_price.toLocaleString("fa-IR")} تومان</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyCart onClose={() => setIsOpen(false)} />
              )}
            </div>

            {/* Footer */}
            {cart.items.length > 0 && (
              <div className="px-4 pb-4 space-y-4">
                <div className="flex items-center justify-between text-xl font-semibold">
                  <p className="text-zinc-600">جمع کل:</p>
                  <p>{cart.total_price.toLocaleString("fa-IR")} تومان</p>
                </div>
                <Link
                  href="/profile/cart"
                  onClick={() => setIsOpen(false)}
                  className="btn-primary w-full rounded-xl text-center font-semibold py-3 block"
                >
                  مشاهده سبد خرید
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}