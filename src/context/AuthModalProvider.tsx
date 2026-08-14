"use client";

import { useDisclosure } from "@heroui/react";
import { useSearchParams } from "next/navigation";
import React, {
  createContext,
  useContext,
  useEffect,
  Suspense,
  ReactNode,
} from "react";

interface AuthModalContextType {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | null>(null);

const InnerAuthModalProvider = ({ children }: { children: ReactNode }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const searchParams = useSearchParams();
  const authRequired = searchParams.get("authRequired");

  useEffect(() => {
    if (authRequired === "true") {
      onOpen();
    }
  }, [authRequired, onOpen]);

  return (
    <AuthModalContext.Provider
      value={{ isOpen, onOpen, onOpenChange, onClose }}
    >
      {children}
    </AuthModalContext.Provider>
  );
};

export const AuthModalProvider = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense fallback={null}>
      <InnerAuthModalProvider>{children}</InnerAuthModalProvider>
    </Suspense>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
};
