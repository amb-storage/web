// Đơn vừa tạo trước khi chuyển sang Stripe; trang /checkout/success đọc lại để hiện mã đơn và xoá giỏ.
// Dùng sessionStorage (theo tab) vì Stripe redirect về đúng tab đã bấm thanh toán.
const STORAGE_KEY = "amb-pending-checkout";

export interface PendingCheckout {
    orderId: string;
    email: string;
    // Đã xoá giỏ hàng chưa (reload trang success không xoá lại lần nữa)
    cartCleared?: boolean;
}

export function savePendingCheckout(checkout: PendingCheckout) {
    try {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(checkout));
    } catch {
        // Trình duyệt chặn storage: trang success vẫn hiện được, chỉ thiếu mã đơn
    }
}

export function readPendingCheckoutRaw() {
    try {
        return window.sessionStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
}

export function parsePendingCheckout(raw: string | null): PendingCheckout | null {
    if (!raw) return null;
    try {
        const value: unknown = JSON.parse(raw);
        if (
            typeof value === "object" &&
            value !== null &&
            "orderId" in value &&
            typeof value.orderId === "string" &&
            "email" in value &&
            typeof value.email === "string"
        ) {
            return value as PendingCheckout;
        }
    } catch {
        // JSON hỏng thì coi như không có đơn
    }
    return null;
}

export function removePendingCheckout() {
    try {
        window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
        // bỏ qua
    }
}

// Cùng công thức mã đơn backend dùng trong email hoá đơn / admin (orders.service: `AMB-${orderId.slice(0, 8)}`)
export function toOrderNumber(orderId: string) {
    return `AMB-${orderId.slice(0, 8).toUpperCase()}`;
}
