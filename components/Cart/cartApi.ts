import { apiRequest } from "@/lib/api/client";
import type {
    ApiCart,
    ApiCheckoutSession,
    ApiLocale,
    ApiProductDetail,
} from "@/lib/api/types";

// GET /cart cũng là nơi backend cấp cookie Guest Cart + token CSRF mới
export function fetchCart(locale: ApiLocale) {
    return apiRequest<ApiCart>("/cart", { locale });
}

function mutate<T>(locale: ApiLocale, path: string, method: "POST" | "PATCH" | "DELETE", body?: unknown) {
    return apiRequest<T>(
        path,
        { locale, method, body, idempotent: true },
        () => fetchCart(locale),
    );
}

export function addCartItem(locale: ApiLocale, productId: string, quantity: number) {
    return mutate<ApiCart>(locale, "/cart/items", "POST", { productId, quantity });
}

export function updateCartItem(locale: ApiLocale, productId: string, quantity: number) {
    return mutate<ApiCart>(locale, `/cart/items/${productId}`, "PATCH", { quantity });
}

export function removeCartItem(locale: ApiLocale, productId: string) {
    return mutate<ApiCart>(locale, `/cart/items/${productId}`, "DELETE");
}

// Xoá toàn bộ dòng trong giỏ (dùng sau khi thanh toán thành công)
export function clearCartItems(locale: ApiLocale) {
    return mutate<ApiCart>(locale, "/cart/items", "DELETE");
}

export function mergeGuestCart(locale: ApiLocale) {
    return mutate<ApiCart>(locale, "/cart/merge", "POST");
}

export function createCheckoutSession(
    locale: ApiLocale,
    input: { email: string; successUrl: string; cancelUrl: string },
) {
    return mutate<ApiCheckoutSession>(locale, "/checkout/sessions", "POST", input);
}

// Cart không trả ảnh, nên lấy ảnh đại diện từ chi tiết sản phẩm
export async function fetchProductImage(locale: ApiLocale, slug: string) {
    const product = await apiRequest<ApiProductDetail>(
        `/products/${encodeURIComponent(slug)}`,
        { locale },
    );
    return (product.primaryMedia ?? product.media[0])?.url ?? null;
}

// Mã lỗi backend → key trong namespace `cart.errors`
export function cartErrorKey(code: string) {
    if (code === "INSUFFICIENT_STOCK" || code === "CART_QUANTITY_INVALID") return "errors.stock";
    if (code === "CART_PRODUCT_NOT_PURCHASABLE" || code === "CHECKOUT_CART_INVALID")
        return "errors.unavailable";
    if (code.startsWith("STRIPE_")) return "errors.checkout";
    if (code.endsWith("RATE_LIMITED")) return "errors.rateLimited";
    return "errors.generic";
}
