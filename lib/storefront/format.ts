import type { Money } from "./types";

export function formatMoney(money: Money) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: money.currency,
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  }).format(money.amount);
}

// Ngày đăng bài (ISO) → "2026.01.15"
export function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
}
