"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useCallback } from "react";

function GalleryModal({ children }: { children: ReactNode }) {
  const router = useRouter();

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 animate-fade"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full container max-h-[90vh] overflow-auto rounded-t-lg bg-white p-6 shadow-lg animate-fade-up">
        <button
          onClick={handleClose}
          className="absolute top-2 right-3 text-2xl font-bold text-gray-500 hover:text-gray-800"
          aria-label="Close"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

export default GalleryModal;
