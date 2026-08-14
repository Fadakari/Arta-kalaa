"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { ProductColor, ProductMaterial } from "@/types/product";

interface ProductOptionsContextType {
  selectedColor: ProductColor | null;
  setSelectedColor: (color: ProductColor | null) => void;
  selectedMaterial: ProductMaterial | null;
  setSelectedMaterial: (material: ProductMaterial | null) => void;
}

const ProductContext = createContext<ProductOptionsContextType | undefined>(
  undefined
);

interface ProviderProps {
  children: ReactNode;
  product: { color?: ProductColor[]; material?: ProductMaterial[] };
}

export const ProductProvider = ({ children, product }: ProviderProps) => {
  const colors = product.color ?? [];
  const materials = product.material ?? [];

  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(
    colors.length ? colors[0] : null
  );

  const [selectedMaterial, setSelectedMaterial] =
    useState<ProductMaterial | null>(materials.length ? materials[0] : null);

  return (
    <ProductContext.Provider
      value={{
        selectedColor,
        setSelectedColor,
        selectedMaterial,
        setSelectedMaterial,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProductOptions = () => {
  const context = useContext(ProductContext);
  if (!context)
    throw new Error("useProductOptions must be used within a ProductProvider");
  return context;
};
