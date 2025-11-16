export type ApiOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: unknown;
  credentials?: RequestCredentials;
};

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_API?.replace(/\/$/, "") || "";

// Helper để lấy token từ localStorage (client-side only)
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem('auth_token');
  } catch {
    return null;
  }
}

// Accept either a plain headers map (legacy) or a full ApiOptions object
type MaybeHeadersOrOptions = Record<string, string> | ApiOptions | undefined;
function normalizeOptions(m?: MaybeHeadersOrOptions): ApiOptions {
  if (!m) return {};
  // If it already looks like ApiOptions (has credentials/method/body), return as-is
  const maybe = m as ApiOptions;
  if (
    typeof maybe.method !== "undefined" ||
    typeof maybe.credentials !== "undefined" ||
    typeof maybe.body !== "undefined"
  ) {
    return maybe;
  }
  // Otherwise treat as headers map
  return { headers: m as Record<string, string> };
}

export async function apiFetch<T = unknown>(path: string, options: ApiOptions = {}): Promise<T> {
  if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_SERVER_API is not set. Please configure your backend base URL.");
  }
  const url = `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

  const { body, headers, method = "GET", credentials } = options;

  // Tự động thêm Authorization header nếu có token
  const token = getAuthToken();
  const authHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

  const init: RequestInit = {
    method,
    headers: {
      Accept: "application/json",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...authHeaders,
      ...(headers || {}),
    } as HeadersInit,
    ...(body !== undefined ? { body: typeof body === "string" ? body : JSON.stringify(body) } : {}),
    ...(credentials ? { credentials } : {}),
  };

  const res = await fetch(url, init);
  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text as unknown;
  }

  if (!res.ok) {
    const obj = (typeof data === 'object' && data !== null) ? (data as Record<string, unknown>) : {};
    const message = (typeof obj.message === 'string' && obj.message)
      || (typeof obj.error === 'string' && obj.error)
      || `Request failed (${res.status})`;
    const err = new Error(message) as Error & { status?: number };
    (err as { status?: number }).status = res.status;
    throw err;
  }
  return data as T;
}

export const api = {
  // each method accepts optional third arg that can be either headers map or ApiOptions
  get: <T = unknown>(path: string, opts?: MaybeHeadersOrOptions) =>
    apiFetch<T>(path, { method: "GET", ...normalizeOptions(opts) }),
  post: <T = unknown>(path: string, body?: unknown, opts?: MaybeHeadersOrOptions) =>
    apiFetch<T>(path, { method: "POST", body, ...normalizeOptions(opts) }),
  put: <T = unknown>(path: string, body?: unknown, opts?: MaybeHeadersOrOptions) =>
    apiFetch<T>(path, { method: "PUT", body, ...normalizeOptions(opts) }),
  patch: <T = unknown>(path: string, body?: unknown, opts?: MaybeHeadersOrOptions) =>
    apiFetch<T>(path, { method: "PATCH", body, ...normalizeOptions(opts) }),
  delete: <T = unknown>(path: string, opts?: MaybeHeadersOrOptions) =>
    apiFetch<T>(path, { method: "DELETE", ...normalizeOptions(opts) }),
};

export type LoginResponse = { token?: string; accessToken?: string; [k: string]: unknown };
export type RegisterResponse = { success?: boolean; message?: string; [k: string]: unknown };

export function getTokenFromResponse(resp: LoginResponse): string | null {
  return resp?.token || resp?.accessToken || null;
}

// Types cho danh sách sản phẩm (rút gọn theo payload mock)
export type Product = {
  id: number;
  ten: string;
  mota?: string;
  xuatxu?: string;
  sanxuat?: string;
  mediaurl?: string;
  luotxem?: number;
  ngaycapnhat?: string;
  [k: string]: unknown;
};

export type ProductListResponse = {
  status: boolean;
  message?: string;
  data: Product[];
};

export function fetchProducts(headers?: Record<string, string>) {
  return api.get<ProductListResponse>("/api/sanphams", headers);
}

// Types cho sanphams-all (card list)
export type ProductCard = {
  id: number;
  ten: string;
  slug: string;
  mediaurl?: string;
  rating: { average: number; count: number };
  sold: { total_sold: number; total_quantity: number | string };
  gia: { current: number; before_discount: number | string | null; discount_percent: number };
  trangthai: { active: string; in_stock: boolean };
  [k: string]: unknown;
};

export type PaginatedResponse<T> = {
  data: T[];
  links?: Record<string, unknown>;
  meta?: Record<string, unknown>;
};

export function fetchAllProducts(
  params?: {
    filter?: "popular" | "latest" | "trending" | "matches";
    q?: string;
    page?: number;
    pape?: number; // hỗ trợ tham số sai chính tả nếu có
    per_page?: number;
    user_id?: string;
  },
  headers?: Record<string, string>
) {
  const usp = new URLSearchParams();
  if (params?.filter) usp.set("filter", params.filter);
  if (params?.q) usp.set("q", params.q);
  if (params?.page) usp.set("page", String(params.page));
  if (params?.pape) usp.set("pape", String(params.pape));
  if (params?.per_page) usp.set("per_page", String(params.per_page));
  if (params?.user_id) usp.set("user_id", params.user_id);
  const qs = usp.toString();
  const path = `/api/sanphams-all${qs ? `?${qs}` : ""}`;
  return api.get<PaginatedResponse<ProductCard>>(path, headers);
}