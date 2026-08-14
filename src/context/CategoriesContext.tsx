"use client";
import React, { createContext, useContext } from "react";
import { CategoryNode } from "@/types/categories";

const CategoriesContext = createContext<CategoryNode[]>([]);

export function CategoriesProvider({
  categories,
  children,
}: {
  categories: CategoryNode[];
  children: React.ReactNode;
}) {
  return (
    <CategoriesContext.Provider value={categories}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  return useContext(CategoriesContext);
}

