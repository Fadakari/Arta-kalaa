"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { User } from "@/types/user";

interface MarketerContextType {
  marketer: any;
}

const MarketerContext = createContext<MarketerContextType | undefined>(
  undefined
);

export const useMarketer = () => {
  const context = useContext(MarketerContext);
  if (!context) {
    throw new Error("useMarketer must be used within a MarketerProvider");
  }
  return context;
};

export const MarketerProvider = ({
  children,
  initialMarketer,
}: {
  children: ReactNode;
  initialMarketer?: User;
}) => {
  const marketer = initialMarketer || null;
  return (
    <MarketerContext.Provider value={{ marketer }}>
      {children}
    </MarketerContext.Provider>
  );
};
