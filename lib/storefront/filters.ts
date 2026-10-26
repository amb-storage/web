import type { Product } from "./types";

// Chỉ AVAILABLE mới mua được; TEMPORARILY_UNAVAILABLE / SOLD_OUT / UNAVAILABLE đều coi như hết hàng
export function isPurchasable(product: Pick<Product, "availability">) {
    return product.availability === "AVAILABLE";
}
