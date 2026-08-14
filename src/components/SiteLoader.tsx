"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import logo from "../../public/logo.png";

interface SiteLoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export default function SiteLoader({
  message = "در حال بارگذاری...",
  fullScreen = true,
}: SiteLoaderProps) {
  return (
    <div
      className={`${
        fullScreen ? "fixed inset-0 z-[9999]" : "relative w-full min-h-[60vh]"
      } flex flex-col items-center justify-center bg-blue-600`}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="flex flex-col items-center gap-6 px-6">
        {/* لوگو با انیمیشن ساده */}
        <motion.div
          className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white/10 p-3 shadow-lg"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src={logo}
            alt="آرتاکالا"
            className="h-full w-full object-contain"
            priority
          />
        </motion.div>

        {/* عنوان */}
        <motion.h2
          className="text-2xl font-bold text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          آرتاکالا
        </motion.h2>

        {/* پیام */}
        <p className="text-sm text-white/80">{message}</p>

        {/* نوار پیشرفت ساده */}
        <div className="relative h-1.5 w-48 overflow-hidden rounded-full bg-white/20">
          <motion.div
            className="h-full w-full rounded-full bg-white"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* سه نقطه متحرک ساده */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-2 w-2 rounded-full bg-white/60"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}