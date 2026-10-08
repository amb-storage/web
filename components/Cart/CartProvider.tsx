"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { products } from "@/data/mock";
import {
  addProductToCart,
  readCartItems,
  removeProductFromCart,
  updateProductQuantity,
} from "./CartState";
import type { CartItem } from "./CartState";

interface CartContextValue {
  items: CartItem[];
  count: number;
  hydrated: boolean;
  has: (productId: string) => boolean;
  add: (productId: string, quantity?: number) => void;
  remove: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "amb-storage-cart";
const validProductIds = new Set(products.map((product) => product.id));

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setItems(readCartItems(window.localStorage.getItem(STORAGE_KEY), validProductIds));
      setHydrated(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((total, item) => total + item.quantity, 0),
      hydrated,
      has: (productId) => items.some((item) => item.productId === productId),
      add: (productId, quantity = 1) => {
        const product = products.find((item) => item.id === productId);
        if (!product) return;
        setItems((current) =>
          addProductToCart(current, product.id, product.availability, quantity),
        );
      },
      remove: (productId) =>
        setItems((current) => removeProductFromCart(current, productId)),
      updateQuantity: (productId, quantity) =>
        setItems((current) =>
          updateProductQuantity(current, productId, quantity),
        ),
    }),
    [hydrated, items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
