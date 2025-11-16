"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type AuthUser = {
  avatar: string;
  id: number | string;
  name: string;
  email?: string;
  phone?: string;
  countryCode?: string | null; // optional for flag
};

export type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (payload: { identifier: string; password: string }) => Promise<void>;
  register: (payload: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    gender?: string;
    birthday?: string | null;
    nationality?: string;
  }) => Promise<void>;
  logout: () => void;
  setUser: (u: AuthUser | null) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  // hydrate from localStorage
  useEffect(() => {
    try {
      const t = localStorage.getItem(TOKEN_KEY);
      const rawUser = localStorage.getItem(USER_KEY);
      setToken(t);
      setUser(rawUser ? (JSON.parse(rawUser) as AuthUser) : null);
    } catch {
      // ignore
    }
  }, []);

  const login = useCallback(async ({ identifier, password }: { identifier: string; password: string }) => {
    const API = process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:4000";
    let res = await fetch(`${API}/api/auth/dang-nhap`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      credentials: "include",
      body: JSON.stringify({ identifier, password }),
    });
    // Fallback for mock older route
    if (res.status === 404) {
      try {
        res = await fetch(`${API}/auth/dang-nhap`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          credentials: "include",
          body: JSON.stringify({ identifier, password }),
        });
      } catch {}
    }
    if (!res.ok) {
      let msg = `Đăng nhập thất bại (HTTP ${res.status}).`;
      try {
        const data = await res.json();
        if (data?.message) msg = `${msg} ${String(data.message)}`;
        else if (Object.keys(data || {}).length) msg = `${msg} ${JSON.stringify(data)}`;
      } catch {
        try {
          const text = await res.text();
          if (text) msg = `${msg} ${text}`;
        } catch {}
      }
      throw new Error(msg);
    }
    const json = await res.json();
    const tok: string | null = json?.token || json?.accessToken || null;
    const usr: AuthUser | null = json?.user || null;
    setToken(tok);
    setUser(usr);
    try {
      if (tok) localStorage.setItem(TOKEN_KEY, tok);
      if (usr) localStorage.setItem(USER_KEY, JSON.stringify(usr));
    } catch {}
  }, []);

  const register = useCallback(async (
    {
      name,
      email,
      password,
      phone,
      gender,
      birthday,
      nationality,
    }: {
      name: string;
      email: string;
      password: string;
      phone?: string;
      gender?: string;
      birthday?: string | null;
      nationality?: string;
    }
  ) => {
    const API = process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:4000";
    let res = await fetch(`${API}/api/auth/dang-ky`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, email, password, phone, gender, birthday, nationality }),
    });
    // Fallback for mock older route
    if (res.status === 404) {
      try {
        res = await fetch(`${API}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          credentials: "include",
          body: JSON.stringify({ name, email, password, phone: phone || "", confirmPassword: password, gender, birthday, nationality }),
        });
      } catch {}
    }
    if (!res.ok) {
      let msg = `Đăng ký thất bại (HTTP ${res.status}).`;
      try {
        const data = await res.json();
        if (data?.message) msg = `${msg} ${String(data.message)}`;
        else if (Object.keys(data || {}).length) msg = `${msg} ${JSON.stringify(data)}`;
      } catch {
        try {
          const text = await res.text();
          if (text) msg = `${msg} ${text}`;
        } catch {}
      }
      throw new Error(msg);
    }
    // Không tự đăng nhập; UI sẽ thông báo và chuyển sang tab đăng nhập
  }, []);

  const logout = useCallback(() => {
    (async () => {
      try {
        const API = process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:4000";
        await fetch(`${API}/api/auth/dang-xuat`, { method: "POST", credentials: "include" });
      } catch {}
      setToken(null);
      setUser(null);
      try {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      } catch {}
    })();
  }, []);

  const value = useMemo<AuthContextType>(() => ({
    user,
    token,
    isLoggedIn: !!token && !!user,
    login,
    register,
    logout,
    setUser,
  }), [user, token, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
