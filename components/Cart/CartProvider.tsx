"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useLocale } from "next-intl";
import type { ApiCart, ApiCartItem, ApiCheckoutSessionInput, ApiLocale } from "@/lib/api/types";
import { ApiClientError } from "@/lib/api/client";
import type { Availability, Money } from "@/lib/storefront/types";
import {
  addCartItem,
  clearCartItems,
  createCheckoutSession,
  fetchCart,
  fetchProductImage,
  removeCartItem,
  updateCartItem,
} from "./cartApi";
import { savePendingCheckout } from "./checkoutStorage";

export interface CartLine {
  productId: string;
  slug: string | null;
  name: string | null;
  size: string | null;
  quantity: number;
  // ELIGIBLE = còn mua được; UNAVAILABLE / NOT_PURCHASABLE = đã hết hoặc bị gỡ
  status: ApiCartItem["status"];
  availability: Availability;
  unitPrice: Money | null;
  lineTotal: Money | null;
  image: string | null;
}

interface CartContextValue {
  items: CartLine[];
  count: number;
  subtotal: Money;
  hydrated: boolean;
  pending: boolean;
  // Mã lỗi backend của thao tác gần nhất (vd. CART_QUANTITY_UNAVAILABLE), null nếu ổn
  errorCode: string | null;
  has: (productId: string) => boolean;
  add: (productId: string, quantity?: number) => Promise<void>;
  remove: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clear: () => Promise<void>;
  checkout: (input: ApiCheckoutSessionInput) => Promise<void>;
  refresh: () => Promise<void>;
  setCart: (cart: ApiCart) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function toMoney(price: ApiCart["subtotal"] | null): Money | null {
  return price ? { amount: price.amount, currency: "JPY" } : null;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const locale = useLocale() as ApiLocale;
  const [cart, setCart] = useState<ApiCart | null>(null);
  const [images, setImages] = useState<Record<string, string | null>>({});
  const [hydrated, setHydrated] = useState(false);
  const [pending, setPending] = useState(false);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const run = useCallback(async (action: () => Promise<ApiCart>) => {
    setPending(true);
    setErrorCode(null);
    try {
      setCart(await action());
    } catch (error) {
      setErrorCode(error instanceof ApiClientError ? error.code : "UNKNOWN");
    } finally {
      setPending(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    try {
      setCart(
        await fetchCart(locale).catch((error: unknown) => {
          // Session Customer hết hạn: backend đã xoá cookie, gọi lại sẽ ra giỏ khách vãng lai
          if (error instanceof ApiClientError && error.code === "CUSTOMER_AUTH_SESSION_EXPIRED")
            return fetchCart(locale);
          throw error;
        }),
      );
    } catch (error) {
      setErrorCode(error instanceof ApiClientError ? error.code : "UNKNOWN");
    } finally {
      setHydrated(true);
    }
  }, [locale]);

  // Lấy giỏ hàng lần đầu (và khi đổi ngôn ngữ để tên sản phẩm đúng locale)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- đồng bộ state với giỏ hàng trên server
    void refresh();
  }, [refresh]);

  // Cart API không có ảnh → lấy ảnh cho những dòng chưa có trong cache
  useEffect(() => {
    const missing = (cart?.items ?? []).filter(
      (item) => item.product && !(item.productId in images),
    );
    if (missing.length === 0) return;
    let cancelled = false;
    void Promise.all(
      missing.map(async (item) => {
        const image = await fetchProductImage(locale, item.product!.slug).catch(() => null);
        return [item.productId, image] as const;
      }),
    ).then((entries) => {
      if (!cancelled) setImages((current) => ({ ...current, ...Object.fromEntries(entries) }));
    });
    return () => {
      cancelled = true;
    };
  }, [cart, images, locale]);

  const value = useMemo<CartContextValue>(() => {
    const items: CartLine[] = (cart?.items ?? []).map((item) => ({
      productId: item.productId,
      slug: item.product?.slug ?? null,
      name: item.product?.name ?? null,
      size: item.size,
      quantity: item.quantity,
      status: item.status,
      availability: item.availability,
      unitPrice: toMoney(item.unitPrice),
      lineTotal: toMoney(item.lineTotal),
      image: images[item.productId] ?? null,
    }));

    return {
      items,
      count: cart?.itemCount ?? 0,
      subtotal: toMoney(cart?.subtotal ?? null) ?? { amount: 0, currency: "JPY" },
      hydrated,
      pending,
      errorCode,
      has: (productId) => items.some((item) => item.productId === productId),
      add: (productId, quantity = 1) => run(() => addCartItem(locale, productId, quantity)),
      remove: (productId) => run(() => removeCartItem(locale, productId)),
      updateQuantity: (productId, quantity) =>
        quantity < 1
          ? run(() => removeCartItem(locale, productId))
          : run(() => updateCartItem(locale, productId, quantity)),
      clear: async () => {
        setPending(true);
        setErrorCode(null);
        try {
          setCart(await clearCartItems(locale));
        } catch {
          // Webhook có thể đã expire giỏ cũ → lấy lại giỏ hiện tại (trống) thay vì báo lỗi
          await refresh();
        } finally {
          setPending(false);
        }
      },
      checkout: async (input) => {
        setPending(true);
        setErrorCode(null);
        try {
          const session = await createCheckoutSession(locale, input);
          // Lưu lại để trang /checkout/success hiện mã đơn và xoá giỏ
          savePendingCheckout({ orderId: session.orderId, email: input.email });
          // Chuyển sang trang thanh toán Stripe; kết quả thanh toán do webhook xác nhận
          window.location.assign(session.checkoutUrl);
        } catch (error) {
          setErrorCode(error instanceof ApiClientError ? error.code : "UNKNOWN");
          setPending(false);
        }
      },
      refresh,
      setCart,
    };
  }, [cart, errorCode, hydrated, images, locale, pending, refresh, run]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
