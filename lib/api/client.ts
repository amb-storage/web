"use client";

import type { ApiErrorBody, ApiLocale } from "./types";

// Trình duyệt luôn gọi cùng origin (`/api/v1` được rewrite sang backend) để cookie path `/api/v1` đi kèm
const API_PREFIX = "/api/v1";
const CSRF_HEADER = "X-CSRF-Token";

export class ApiClientError extends Error {
    constructor(
        readonly status: number,
        readonly code: string,
        message: string,
    ) {
        super(message);
        this.name = "ApiClientError";
    }
}

// Token CSRF backend trả qua header; chỉ giữ trong bộ nhớ, không lưu storage
let csrfToken: string | null = null;

interface ApiRequestOptions {
    locale: ApiLocale;
    method?: "GET" | "POST" | "PATCH" | "DELETE";
    body?: unknown;
    // Mutation Cart / Checkout bắt buộc Idempotency-Key
    idempotent?: boolean;
}

async function send(path: string, { locale, method = "GET", body, idempotent }: ApiRequestOptions) {
    const headers: Record<string, string> = {
        Accept: "application/json",
        "Accept-Language": locale,
    };
    if (method !== "GET") {
        headers["Content-Type"] = "application/json";
        if (csrfToken) headers[CSRF_HEADER] = csrfToken;
        if (idempotent) headers["Idempotency-Key"] = crypto.randomUUID();
    }
    const response = await fetch(`${API_PREFIX}${path}`, {
        method,
        headers,
        credentials: "include",
        cache: "no-store",
        body: method === "GET" ? undefined : JSON.stringify(body ?? {}),
    });
    const nextToken = response.headers.get(CSRF_HEADER);
    if (nextToken) csrfToken = nextToken;
    return response;
}

async function toError(response: Response) {
    const body = (await response.json().catch(() => null)) as Partial<ApiErrorBody> | null;
    const message = Array.isArray(body?.message)
        ? body.message.join(", ")
        : (body?.message ?? response.statusText);
    return new ApiClientError(response.status, body?.code ?? "UNKNOWN", message);
}

export async function apiRequest<T>(
    path: string,
    options: ApiRequestOptions,
    refreshCsrf?: () => Promise<unknown>,
): Promise<T> {
    let response = await send(path, options);
    // Chưa có / hết hạn token CSRF → lấy token mới rồi thử lại đúng 1 lần
    if (response.status === 403 && refreshCsrf && options.method && options.method !== "GET") {
        const error = await toError(response.clone());
        if (error.code === "CSRF_INVALID") {
            await refreshCsrf();
            response = await send(path, options);
        }
    }
    if (!response.ok) throw await toError(response);
    return (await response.json()) as T;
}
