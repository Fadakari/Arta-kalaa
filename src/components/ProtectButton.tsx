"use client";

import { useAuthModal } from "@/context/AuthModalProvider";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import React from "react";

type ProductButtonProps = {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  href?: string;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const ProductButton = ({
  children,
  onClick,
  href,
  className,
  ...rest
}: ProductButtonProps) => {
  const { user } = useUser();
  const { onOpen } = useAuthModal();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!user?.identity) {
      e.preventDefault();
      e.stopPropagation();
      onOpen();
      return;
    }

    if (href) {
      router.push(href);
    }

    onClick?.(e);
  };

  return (
    <button onClick={handleClick} className={className} {...rest}>
      {children}
    </button>
  );
};

export default ProductButton;
