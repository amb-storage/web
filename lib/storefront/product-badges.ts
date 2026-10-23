import { isPurchasable } from "./filters";
import type { Product } from "./types";

export interface ProductBadge {
  id: string;
  label: string;
  variant: "default" | "accent" | "brand" | "sold";
}

// Backend không còn trả tag sản phẩm, nên badge hiện chỉ còn trạng thái hết hàng
export function getProductBadges(product: Product): ProductBadge[] {
  return isPurchasable(product)
    ? []
    : [{ id: "availability-sold", label: "SOLD", variant: "sold" }];
}
