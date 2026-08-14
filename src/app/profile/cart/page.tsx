"use client";
export const dynamic = 'force-dynamic';
import { CartItem } from "@/types/cartItem";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { HiXMark } from "react-icons/hi2";
import { MdChevronLeft } from "react-icons/md";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  NumberInput,
  Spinner,
} from "@heroui/react";
import { CiImageOff } from "react-icons/ci";
import { IoCartOutline } from "react-icons/io5";
import { useCart } from "../../../context/CartContextProvider";
import EmptyCart from "../../../components/EmptyCart";
function Page() {
  const { cart, loading } = useCart();

  return (
    <div className="grid md:grid-cols-5 items-start gap-5 p-4  overflow-y-auto h-[600px] ]  w-full">
      {loading ? (
        <div className="col-span-3 w-full h-full p-5 flex items-center justify-center">
          درحال دریافت اطلاعات سبد خرید ...{" "}
        </div>
      ) : cart.total_items > 0 ? (
        <ul className="col-span-3 rounded-sm p-5 flex flex-col gap-4 shadow divide-y divide-zinc-200 border border-zinc-300  ">
          {cart.items.map((item: CartItem) => (
            <CartLi item={item} key={item.id} />
          ))}{" "}
        </ul>
      ) : (
        <div className="col-span-5 p-5">
          {" "}
          <EmptyCart />{" "}
        </div>
      )}

      {cart.total_items > 0 && (
        <div className="col-span-3 md:col-span-2 shadow rounded-lg h-auto p-5 space-y-2 border border-zinc-300 sticky top-5">
          <div className="flex items-center justify-between ">
            <p>
              قیمت کالاها ({cart.items.length.toLocaleString("fa-IR")} کالا)
            </p>
            <p className="font-semibold text-xl">
              {cart.total_price.toLocaleString("fa-IR")}
              <span className="pr-1 text-sm">تومان</span>
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p>هزینه ارسال</p>
            <p className="font-semibold text-xl">
              {cart.total_delivery.toLocaleString("fa-IR")}
              <span className="pr-1 text-sm">تومان</span>
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-zinc-200 pt-2 mt-2">
            <p>جمع نهایی</p>
            <p className="font-semibold text-xl">
              {cart.final_price.toLocaleString("fa-IR")}
              <span className="pr-1 text-sm">تومان</span>
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Link
              href="/profile/checkout"
              className="btn btn-primary w-full relative font-semibold text-center"
            >
              ادامه ثبت سفارش{" "}
              <IoCartOutline className="size-8 absolute right-5 top-2.5" />
            </Link>
          </div>
        </div>
      )}
      <style jsx>{`
        .overflow-y-auto::-webkit-scrollbar {
          width: 3px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background-color: #4f9cff;
          border-radius: 10px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background-color: #f1f1f1;
          border-radius: 10px;
        }

        .overflow-y-auto::-webkit-scrollbar:hover {
          width: 12px;
        }
      `}</style>
    </div>
  );
}

function CartLi({ item }: { item: CartItem }) {
  const { removeFromCart, setQuantityToItem, loading } = useCart();
  const [quantity, setQuantity] = useState(item.quantity);
  const [newQuantity, setNewQuantity] = useState<number | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (item.quantity !== quantity) {
      setQuantityToItem(item.id, quantity);
    }
  }, [quantity, item.id, item.quantity, setQuantityToItem]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropDownOpen(false);
      }
    };

    if (dropDownOpen)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropDownOpen]);

  return (
    <>
      <li className="flex items-center justify-between p-4 relative">
        {loading && (
          <div className="absolute top-0 right-0 size-full bg-white/80 flex items-center justify-center cursor-wait">
            <Spinner size="lg" />
          </div>
        )}

        <div className="flex flex-col justify-center text-center w-28">
          <Link
            href={`/product/${item.product.slug}`}
            className="min-h-28 flex items-center justify-center relative"
          >
            {item.product.cover_image ? (
              <Image
                src={item.product.cover_image}
                alt={item.product.name}
                width={100}
                height={100}
                className="object-cover w-28 min-h-28 max-w-full rounded-md"
              />
            ) : (
              <div className="w-28 min-h-28 h-full max-w-full bg-zinc-200 rounded-md flex items-center justify-center mb-2">
                <CiImageOff className="size-15" />
              </div>
            )}
          </Link>

          <div className="relative mx-auto" ref={dropdownRef}>
            <button
              onClick={() => setDropDownOpen(!dropDownOpen)}
              className="w-full p-3 flex items-center justify-between font-bold border border-zinc-300 font-dana"
            >
              {quantity} عدد
              <MdChevronLeft className="w-5 h-5 text-zinc-500 -rotate-90" />
            </button>

            {dropDownOpen && (
              <div className="absolute right-0 top-11 bg-white w-full sm:w-44 z-10 border border-zinc-300 shadow-lg rounded-md">
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    className={`w-full p-3 flex items-center justify-between font-bold hover:bg-primary-200 font-dana ${
                      num === quantity ? "bg-primary-200" : ""
                    }`}
                    onClick={() => {
                      setQuantity(num);
                      setDropDownOpen(false);
                    }}
                  >
                    {num} عدد
                  </button>
                ))}

                <button
                  onClick={() => {
                    onOpen();
                    setDropDownOpen(false);
                  }}
                  className="w-full p-3 flex items-center justify-between font-bold hover:bg-primary-200"
                >
                  وارد کردن مقدار دلخواه
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between w-[80%] items-start pr-2">
          <div className="flex flex-col justify-between h-full px-2">
            <p className="font-semibold text-lg">{item.product.name}</p>
            <div className="flex gap-2 items-center py-2">
              {item.color_variant && (
                <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5 border border-zinc-200 shadow-2xs cursor-default">
                  <div
                    className="w-3 h-3 rounded-full border border-zinc-300 shadow-inner"
                    style={{
                      backgroundColor: `#${item.color_variant.color_code}`,
                    }}
                  ></div>
                  <span className="text-sm text-zinc-800 font-medium">
                    {item.color_variant.color_name}
                  </span>
                </div>
              )}

              {item.material_variant && (
                <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5 border border-zinc-200 shadow-2xs cursor-default">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-br from-zinc-400 to-zinc-500 border border-zinc-300 shadow-inner"></div>
                  <span className="text-sm text-zinc-800 font-medium">
                    {item.material_variant.material_name}
                  </span>
                </div>
              )}
            </div>
            <div>
              <p>
                <span className="text-zinc-600">قیمت واحد:</span>{" "}
                {item.unit_price.toLocaleString("fa-IR")} تومان
              </p>
              <p>
                <span className="text-zinc-600">قیمت کل:</span>{" "}
                {item.total_price.toLocaleString("fa-IR")} تومان
              </p>
            </div>
          </div>

          <button
            onClick={() => removeFromCart(item.id)}
            className="bg-zinc-200 text-zinc-500 p-2 rounded"
          >
            <FaRegTrashAlt className="size-5" />
          </button>
        </div>
      </li>

      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        hideCloseButton
        onOpenChange={onOpenChange}
        size="lg"
        placement="bottom-center"
      >
        <ModalContent>
          {(onClose) => (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newQuantity) return;
                setQuantity(newQuantity);
                onClose();
              }}
            >
              <ModalHeader className="flex justify-between items-center">
                <p>وارد کردن مقدار دلخواه</p>
                <button type="button" onClick={onClose}>
                  <HiXMark className="size-6" />
                </button>
              </ModalHeader>
              <ModalBody>
                <NumberInput
                  value={newQuantity || undefined}
                  onValueChange={(value: number) => setNewQuantity(value)}
                  hideStepper
                  minValue={1}
                  classNames={{
                    inputWrapper: "input !rounded-full",
                    input: "input font-dana border-none",
                  }}
                  aria-label="مقدار سبد خرید"
                />
              </ModalBody>
              <ModalFooter>
                <button className="w-full btn-primary" type="submit">
                  اعمال مقدار
                </button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default Page;
