import type { Money, Product } from "./types";

export function formatMoney(money: Money) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: money.currency,
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  }).format(money.amount);
}

export function getProductPriceDisplay(product: Product, taxInLabel: string) {
  if (product.availability === "SOLD_OUT") {
    return { status: "SOLD" as const, price: null, taxIn: null };
  }

  return {
    status: null,
    price: formatMoney(product.price),
    taxIn: taxInLabel,
  };
}
