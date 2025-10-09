export type ApiOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  credentials?: RequestCredentials;
};

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_API?.replace(/\/$/, "") || "";

export async function apiFetch<T = any>(path: string, options: ApiOptions = {}): Promise<T> {
  if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_SERVER_API is not set. Please configure your backend base URL.");
  }
  const url = `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

  const { body, headers, method = "GET", credentials } = options;
  const init: RequestInit = {
    method,
    headers: {
      "Accept": "application/json",
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(headers || {}),
    },
    ...(body !== undefined ? { body: typeof body === "string" ? body : JSON.stringify(body) } : {}),
    ...(credentials ? { credentials } : {}),
  };

  const res = await fetch(url, init);
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text as any; }

  if (!res.ok) {
    const message = (data && (data.message || data.error)) || `Request failed (${res.status})`;
    const err: any = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data as T;
}

export const api = {
  get: <T = any>(path: string, headers?: Record<string,string>) => apiFetch<T>(path, { method: "GET", headers }),
  post: <T = any>(path: string, body?: any, headers?: Record<string,string>) => apiFetch<T>(path, { method: "POST", body, headers }),
  put: <T = any>(path: string, body?: any, headers?: Record<string,string>) => apiFetch<T>(path, { method: "PUT", body, headers }),
  patch: <T = any>(path: string, body?: any, headers?: Record<string,string>) => apiFetch<T>(path, { method: "PATCH", body, headers }),
  delete: <T = any>(path: string, headers?: Record<string,string>) => apiFetch<T>(path, { method: "DELETE", headers }),
};

export type LoginResponse = { token?: string; accessToken?: string; [k: string]: any };
export type RegisterResponse = { success?: boolean; message?: string; [k: string]: any };

export function getTokenFromResponse(resp: LoginResponse): string | null {
  return resp?.token || resp?.accessToken || null;
}
