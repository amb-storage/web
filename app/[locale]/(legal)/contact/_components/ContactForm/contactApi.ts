import { apiRequest } from "@/lib/api/client";
import type { ApiContactAccepted, ApiContactRequest } from "@/lib/api/types";

// Form công khai, không cần phiên đăng nhập; chống spam bằng honeypot + rate limit phía backend
export function sendContact(body: ApiContactRequest) {
    return apiRequest<ApiContactAccepted>("/contact", { locale: body.locale, method: "POST", body });
}
