"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { CartItem } from "@/types/cartItem";
import { useCartActions } from "@/hooks/useCartActions";

export type CartFormat = {
  total_items: number;
  total_quantity: number;
  total_price: number;
  total_delivery: number;
  final_price: number;
  items: any[];
};

type CartContextType = {
  cart: CartFormat;
  loading: boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number) => void;
  incrementQuantity: (productId: number) => void;
  decrementQuantity: (productId: number) => void;
  setQuantityToItem: (productId: number, quantity: number) => void;
  clearCart: () => void;
  refreshCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartFormat>({
    total_items: 0,
    total_quantity: 0,
    total_price: 0,
    total_delivery: 0,
    final_price: 0,
    items: [],
  });
  const [loading, setLoading] = useState(false);
  const {
    fetchCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    increment,
    decrement,
  } = useCartActions(setCart, setLoading, cart);

  useEffect(() => {
    const scheduleFetch = () => fetchCart();
    const idleCallback = window.requestIdleCallback?.bind(window);
    const cancelIdleCallback = window.cancelIdleCallback?.bind(window);

    if (idleCallback) {
      const idleId = idleCallback(scheduleFetch, { timeout: 2000 });
      return () => cancelIdleCallback?.(idleId);
    }

    const timer = window.setTimeout(scheduleFetch, 1500);
    return () => window.clearTimeout(timer);
  }, [fetchCart]);
  const refreshCart = async () => {
    setLoading(true);
    await fetchCart();
    setLoading(false);
  };
  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        incrementQuantity: increment,
        decrementQuantity: decrement,
        setQuantityToItem: updateQuantity,
        refreshCart,
        clearCart: () => {},
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart باید داخل CartProvider استفاده شود");
  return ctx;
};
