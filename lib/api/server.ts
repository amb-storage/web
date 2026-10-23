import type { ApiErrorBody, ApiLocale } from "./types";

// Server component gọi thẳng backend; trình duyệt thì đi qua rewrite `/api/v1/*` trong next.config.ts
export const API_BASE_URL = (
    process.env.API_BASE_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");

// Mặc định cache 60s cho nội dung public (backend cũng trả Cache-Control public ngắn)
const DEFAULT_REVALIDATE = 60;

export class ApiError extends Error {
    constructor(
        readonly status: number,
        readonly code: string,
        message: string,
    ) {
        super(message);
        this.name = "ApiError";
    }
}

export type ApiQueryValue = string | number | boolean | undefined | null;
export type ApiQuery = Record<string, ApiQueryValue | readonly ApiQueryValue[]>;

interface ApiGetOptions {
    locale: ApiLocale;
    query?: ApiQuery;
    revalidate?: number;
}

export function buildQueryString(query: ApiQuery = {}) {
    const search = new URLSearchParams();
    for (const [key, raw] of Object.entries(query)) {
        // Mảng gửi dạng lặp key (`category=a&category=b`) đúng như backend parse
        const values = Array.isArray(raw) ? raw : [raw];
        for (const value of values) {
            if (value === undefined || value === null || value === "") continue;
            search.append(key, String(value));
        }
    }
    const result = search.toString();
    return result ? `?${result}` : "";
}

export async function readApiError(response: Response) {
    const body = (await response.json().catch(() => null)) as Partial<ApiErrorBody> | null;
    const message = Array.isArray(body?.message)
        ? body.message.join(", ")
        : (body?.message ?? response.statusText);
    return new ApiError(response.status, body?.code ?? "UNKNOWN", message);
}

export async function apiGet<T>(
    path: string,
    { locale, query, revalidate = DEFAULT_REVALIDATE }: ApiGetOptions,
): Promise<T> {
    const response = await fetch(
        `${API_BASE_URL}/api/v1${path}${buildQueryString(query)}`,
        {
            headers: { Accept: "application/json", "Accept-Language": locale },
            next: { revalidate },
        },
    );
    if (!response.ok) throw await readApiError(response);
    return (await response.json()) as T;
}

// 404 trả null để page tự gọi notFound(); lỗi khác vẫn ném ra cho error boundary
export async function apiGetOrNull<T>(
    path: string,
    options: ApiGetOptions,
): Promise<T | null> {
    try {
        return await apiGet<T>(path, options);
    } catch (error) {
        if (error instanceof ApiError && error.status === 404) return null;
        throw error;
    }
}
