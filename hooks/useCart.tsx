"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./useAuth";

const CART_STORAGE_KEY = "marketpro_cart";

// Helper để lấy headers với token
function getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json"
    };
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        if (token) headers.Authorization = `Bearer ${token}`;
    }
    return headers;
}

export type CartItem = {
    id_bienthesp: number;
    quantity: number;
    product?: {
        id?: number | string;
        ten?: string;
        mediaurl?: string;
        gia?: { current?: number };
    };
};

/**
 * Hook quản lý giỏ hàng thống nhất:
 * - Chưa đăng nhập: lưu localStorage
 * - Đã đăng nhập: sync với server
 * - Khi đăng nhập: merge giỏ local vào server
 */
export function useCart() {
    const { isLoggedIn } = useAuth();
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const hasSyncedRef = useRef(false); // Track xem đã sync chưa

    const API = (() => {
        const raw = process.env.NEXT_PUBLIC_SERVER_API || "http://localhost:4000";
        try {
            if (typeof window === "undefined") return raw;
            const u = new URL(raw);
            const host = window.location.hostname;
            if (
                (u.hostname === "127.0.0.1" && host === "localhost") ||
                (u.hostname === "localhost" && host === "127.0.0.1")
            ) {
                u.hostname = host;
            }
            return u.origin;
        } catch {
            return raw;
        }
    })();

    // Đọc giỏ hàng từ localStorage
    const loadLocalCart = useCallback((): CartItem[] => {
        if (typeof window === "undefined") return [];
        try {
            const saved = localStorage.getItem(CART_STORAGE_KEY);
            if (!saved) return [];
            const parsed = JSON.parse(saved);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }, []);

    // Lưu giỏ hàng vào localStorage
    const saveLocalCart = useCallback((cart: CartItem[]) => {
        if (typeof window === "undefined") return;
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        } catch (err) {
            console.error("Lỗi lưu giỏ hàng:", err);
        }
    }, []);

    // Xóa giỏ hàng local
    const clearLocalCart = useCallback(() => {
        if (typeof window === "undefined") return;
        try {
            localStorage.removeItem(CART_STORAGE_KEY);
        } catch { }
    }, []);

    // Đọc giỏ hàng từ server
    const loadServerCart = useCallback(async (): Promise<CartItem[]> => {
        try {
            const res = await fetch(`${API}/api/toi/giohang`, {
                credentials: "include",
                headers: getAuthHeaders(),
                cache: "no-store",
            });
            if (!res.ok) return [];
            const j = await res.json();
            return Array.isArray(j?.data) ? j.data : [];
        } catch {
            return [];
        }
    }, [API]);

    // Merge giỏ local vào server khi đăng nhập
    const syncLocalToServer = useCallback(async () => {
        const localItems = loadLocalCart();
        console.log('🔄 Syncing local cart to server:', localItems);

        if (localItems.length === 0) {
            console.log('⚠️ No local items to sync');
            return;
        }

        setLoading(true);
        try {
            // Thêm từng item vào server
            for (const item of localItems) {
                console.log('📤 Sending item to server:', item);
                const res = await fetch(`${API}/api/toi/giohang`, {
                    method: "POST",
                    headers: getAuthHeaders(),
                    credentials: "include",
                    body: JSON.stringify({
                        id_bienthesp: item.id_bienthesp,
                        quantity: item.quantity,
                    }),
                });
                const data = await res.json();
                console.log('📥 Server response:', res.status, data);
            }
            // Xóa giỏ local sau khi sync
            clearLocalCart();
            console.log('🗑️ Local cart cleared');

            // Reload giỏ từ server
            const serverCart = await loadServerCart();
            console.log('✅ Server cart loaded:', serverCart);
            setItems(serverCart);
            try { window.dispatchEvent(new CustomEvent("cart:updated", { detail: { count: serverCart.reduce((s, it) => s + (Number(it.quantity) || 0), 0) } })); } catch { }
        } catch (err) {
            console.error("❌ Lỗi đồng bộ giỏ hàng:", err);
        } finally {
            setLoading(false);
        }
    }, [API, loadLocalCart, clearLocalCart, loadServerCart]);

    // Load giỏ hàng (local hoặc server)
    const fetchCart = useCallback(async () => {
        setLoading(true);
        try {
            if (isLoggedIn) {
                const serverCart = await loadServerCart();
                setItems(serverCart);
            } else {
                const localCart = loadLocalCart();
                console.log('🛒 Local cart loaded:', localCart);
                console.log('🌐 API URL:', API);

                // Fetch thông tin sản phẩm cho mỗi item
                const enrichedCart = await Promise.all(
                    localCart.map(async (item) => {
                        try {
                            const url = `${API}/api/sanphams/${item.id_bienthesp}`;
                            console.log('📡 Fetching product from:', url);
                            const res = await fetch(url);
                            console.log('📡 Response status:', res.status);
                            if (res.ok) {
                                const json = await res.json();
                                console.log('✅ Raw response:', json);
                                // Mock API trả về { status, data } structure
                                const product = json.data || json;
                                console.log('✅ Product data:', product);
                                return { ...item, product };
                            }
                        } catch (err) {
                            console.error(`❌ Failed to fetch product ${item.id_bienthesp}:`, err);
                        }
                        return item;
                    })
                );
                console.log('🎁 Enriched cart:', enrichedCart);
                setItems(enrichedCart);
            }
        } finally {
            setLoading(false);
        }
    }, [isLoggedIn, loadServerCart, loadLocalCart, API]);

    // Thêm sản phẩm vào giỏ
    const addItem = useCallback(
        async (id_bienthesp: number, quantity = 1) => {
            setLoading(true);
            try {
                if (isLoggedIn) {
                    // Thêm vào server
                    const res = await fetch(`${API}/api/toi/giohang`, {
                        method: "POST",
                        headers: getAuthHeaders(),
                        credentials: "include",
                        body: JSON.stringify({ id_bienthesp, quantity }),
                    });
                    if (res.ok) {
                        const serverCart = await loadServerCart();
                        setItems(serverCart);
                        try { window.dispatchEvent(new CustomEvent("cart:updated", { detail: { count: serverCart.reduce((s, it) => s + (Number(it.quantity) || 0), 0) } })); } catch { }
                    }
                } else {
                    // Thêm vào localStorage
                    const localCart = loadLocalCart();
                    const existingIndex = localCart.findIndex(
                        (item) => item.id_bienthesp === id_bienthesp
                    );

                    if (existingIndex >= 0) {
                        localCart[existingIndex].quantity += quantity;
                    } else {
                        localCart.push({ id_bienthesp, quantity });
                    }

                    saveLocalCart(localCart);
                    setItems(localCart);
                    try { window.dispatchEvent(new CustomEvent("cart:updated", { detail: { count: localCart.reduce((s, it) => s + (Number(it.quantity) || 0), 0) } })); } catch { }
                }
            } catch (err) {
                console.error("Lỗi thêm vào giỏ:", err);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [isLoggedIn, API, loadLocalCart, saveLocalCart, loadServerCart]
    );

    // Xóa sản phẩm
    const removeItem = useCallback(
        async (id_bienthesp: number) => {
            setLoading(true);
            try {
                if (isLoggedIn) {
                    await fetch(`${API}/api/toi/giohang/${id_bienthesp}`, {
                        method: "DELETE",
                        headers: getAuthHeaders(),
                        credentials: "include",
                    });
                    // update local state by filtering
                    setItems((prev) => {
                        const next = prev.filter((it) => it.id_bienthesp !== id_bienthesp);
                        try { window.dispatchEvent(new CustomEvent("cart:updated", { detail: { count: next.reduce((s, it) => s + (Number(it.quantity) || 0), 0) } })); } catch { }
                        return next;
                    });
                } else {
                    const localCart = loadLocalCart();
                    const filtered = localCart.filter((it) => it.id_bienthesp !== id_bienthesp);
                    saveLocalCart(filtered);
                    setItems(filtered);
                    try { window.dispatchEvent(new CustomEvent("cart:updated", { detail: { count: filtered.reduce((s, it) => s + (Number(it.quantity) || 0), 0) } })); } catch { }
                }
            } finally {
                setLoading(false);
            }
        },
        [isLoggedIn, API, loadLocalCart, saveLocalCart]
    );

    // Cập nhật số lượng
    const updateQuantity = useCallback(
        async (id_bienthesp: number, quantity: number) => {
            if (quantity <= 0) {
                return removeItem(id_bienthesp);
            }

            setLoading(true);
            try {
                if (isLoggedIn) {
                    await fetch(`${API}/api/toi/giohang/${id_bienthesp}`, {
                        method: "PUT",
                        headers: getAuthHeaders(),
                        credentials: "include",
                        body: JSON.stringify({ quantity }),
                    });
                    setItems((prev) => {
                        const next = prev.map((it) => (it.id_bienthesp === id_bienthesp ? { ...it, quantity } : it));
                        try { window.dispatchEvent(new CustomEvent("cart:updated", { detail: { count: next.reduce((s, it) => s + (Number(it.quantity) || 0), 0) } })); } catch { }
                        return next;
                    });
                } else {
                    const localCart = loadLocalCart();
                    const updated = localCart.map((it) => (it.id_bienthesp === id_bienthesp ? { ...it, quantity } : it));
                    saveLocalCart(updated);
                    setItems(updated);
                    try { window.dispatchEvent(new CustomEvent("cart:updated", { detail: { count: updated.reduce((s, it) => s + (Number(it.quantity) || 0), 0) } })); } catch { }
                }
            } finally {
                setLoading(false);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isLoggedIn, API, loadLocalCart, saveLocalCart]
    );

    // Xóa toàn bộ giỏ
    const clearCart = useCallback(() => {
        setItems([]);
        if (!isLoggedIn) {
            clearLocalCart();
        }
        try { window.dispatchEvent(new CustomEvent("cart:updated", { detail: { count: 0 } })); } catch { }
    }, [isLoggedIn, clearLocalCart]);

    // Load giỏ khi mount hoặc login state thay đổi
    useEffect(() => {
        (async () => {
            if (isLoggedIn) {
                // Kiểm tra xem có cần sync không
                const localItems = loadLocalCart();
                if (localItems.length > 0 && !hasSyncedRef.current) {
                    // Chỉ sync 1 lần duy nhất
                    hasSyncedRef.current = true;
                    console.log('🔄 Syncing local cart on login');
                    await syncLocalToServer();
                } else if (localItems.length === 0) {
                    // Nếu không có gì trong local, chỉ load từ server
                    console.log('📥 Loading server cart');
                    const serverCart = await loadServerCart();
                    setItems(serverCart);
                }
            } else {
                // Reset flag khi logout
                hasSyncedRef.current = false;
                // Nếu chưa đăng nhập: load từ localStorage
                await fetchCart();
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn]);

    // Listen cho cart:updated event
    useEffect(() => {
        const onUpdated = () => fetchCart();
        window.addEventListener("cart:updated", onUpdated);
        return () => window.removeEventListener("cart:updated", onUpdated);
    }, [fetchCart]);

    // Tính tổng
    const subtotal = items.reduce((sum, it) => {
        const price = Number(it.product?.gia?.current) || 0;
        const qty = Number(it.quantity) || 0;
        return sum + price * qty;
    }, 0);

    const totalItems = items.reduce((sum, it) => sum + (it.quantity || 0), 0);

    return {
        items,
        loading,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        subtotal,
        totalItems,
        refetch: fetchCart,
    };
}
