import type { Availability } from "@/lib/storefront/types";

export interface CartItem {
  productId: string;
  quantity: number;
}

export function addProductToCart(
  items: readonly CartItem[],
  productId: string,
  availability: Availability,
  quantity = 1,
) {
  if (availability === "SOLD_OUT" || quantity < 1) return [...items];

  const existing = items.find((item) => item.productId === productId);
  if (existing) {
    return items.map((item) =>
      item.productId === productId
        ? { ...item, quantity: item.quantity + quantity }
        : item,
    );
  }

  return [...items, { productId, quantity }];
}

export function removeProductFromCart(items: readonly CartItem[], productId: string) {
  return items.filter((item) => item.productId !== productId);
}

export function updateProductQuantity(
  items: readonly CartItem[],
  productId: string,
  quantity: number,
) {
  if (quantity < 1) return removeProductFromCart(items, productId);

  return items.map((item) =>
    item.productId === productId ? { ...item, quantity } : item,
  );
}

export function readCartItems(value: string | null, validProductIds: ReadonlySet<string>) {
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    const items = parsed.flatMap((item): CartItem[] => {
      if (typeof item === "string") {
        return validProductIds.has(item)
          ? [{ productId: item, quantity: 1 }]
          : [];
      }

      if (
        typeof item === "object" &&
        item !== null &&
        "productId" in item &&
        "quantity" in item &&
        typeof item.productId === "string" &&
        typeof item.quantity === "number" &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0 &&
        validProductIds.has(item.productId)
      ) {
        return [{ productId: item.productId, quantity: item.quantity }];
      }

      return [];
    });

    return items.reduce<CartItem[]>((result, item) => {
      const existing = result.find((current) => current.productId === item.productId);
      if (existing) existing.quantity += item.quantity;
      else result.push(item);
      return result;
    }, []);
  } catch {
    return [];
  }
}
