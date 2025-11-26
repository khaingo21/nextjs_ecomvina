"use client";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useAuth } from "./useAuth";
import Cookies from "js-cookie";

const CART_STORAGE_KEY = "marketpro_cart";

// ========================================================================
// 1. TYPE Definitions
// ========================================================================

export type Coupon = {
  id: number;
  code: string;
  giatri: number;
  mota?: string;
  min_order_value?: number;
};

// Interface cho dữ liệu Voucher thô từ Server
interface ServerVoucherRaw {
  id: number;
  magiamgia?: number | string;
  code?: string;
  ma?: string;
  giatri?: number;
  amount?: number;
  mota?: string;
  dieukien?: string;
  description?: string;
  min_order_value?: number;
  don_toi_thieu?: number;
  trangthai?: string;
  [key: string]: unknown;
}

const parseMinOrderValue = (condition?: string, description?: string): number => {
  const text = (condition || "") + " " + (description || "");
  const matches = text.match(/(\d{3,})/g);
  if (matches && matches.length > 0) {
    return Math.max(...matches.map(Number));
  }
  return 0;
};

export type Gia = { current?: number; before_discount?: number };

export type ProductDisplayInfo = {
  id?: number | string;
  ten?: string;
  name?: string;
  mediaurl?: string;
  hinhanh?: string;
  category?: string;
  gia?: Gia;
  ratingAverage?: number;
  ratingCount?: number;
};

export type CartItem = {
  id_giohang: number | string;
  id_bienthe: number | string;
  quantity: number;
  product?: ProductDisplayInfo;
};

interface ServerCartItemRaw {
  id_giohang?: number | string;
  id_nguoidung?: number | string;
  trangthai?: string;
  bienthe?: {
    soluong?: number;
    giagoc?: number;
    thanhtien?: number;
    tamtinh?: number;
    detail?: {
      thuonghieu?: string;
      tensanpham?: string;
      loaisanpham?: string;
      giamgia?: string;
      giagoc?: number;
      giaban?: number;
      hinhanh?: string;
    };
  };
  bienthe_quatang?: unknown; 
}

export type AddToCartInput = {
  id_bienthe?: number | string;
  id?: number | string;
  ten?: string;
  hinhanh?: string;
  gia?: number | Gia;
  [key: string]: unknown;
};

// ========================================================================
// 2. HOOK LOGIC
// ========================================================================

export function useCart() {
  const { isLoggedIn } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Voucher State
  const [appliedVoucher, setAppliedVoucher] = useState<Coupon | null>(null);
  const [availableVouchers, setAvailableVouchers] = useState<Coupon[]>([]);

  const hasSyncedRef = useRef(false);

  const API = process.env.NEXT_PUBLIC_SERVER_API || "http://148.230.100.215";

  const getAuthHeaders = useCallback((): Record<string, string> => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    const token = Cookies.get("access_token");
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  }, []);

  // --- HELPER MAP DATA ---
  const mapServerDataToCartItem = useCallback((serverItem: unknown): CartItem => {
    const sItem = serverItem as ServerCartItemRaw;
    
    const id_giohang = sItem.id_giohang ?? `temp_${Date.now()}_${Math.random()}`;
    const quantity = Number(sItem.bienthe?.soluong ?? 1);
    const detail = sItem.bienthe?.detail;
    
    let productInfo: ProductDisplayInfo | undefined = undefined;
    
    if (detail) {
        const currentPrice = Number(detail.giaban ?? detail.giagoc ?? 0);
        const originPrice = Number(detail.giagoc ?? 0);

        productInfo = {
            id: id_giohang, 
            ten: detail.tensanpham ?? "Sản phẩm",
            mediaurl: detail.hinhanh ?? "/assets/images/thumbs/placeholder.png",
            category: detail.loaisanpham,
            gia: { 
                current: currentPrice, 
                before_discount: originPrice 
            },
            ratingAverage: 5,
            ratingCount: 0
        };
    }

    return { 
        id_giohang, 
        id_bienthe: id_giohang, 
        quantity, 
        product: productInfo 
    };
  }, []);

  // --- FETCH CART ---
  const loadServerCart = useCallback(async (): Promise<CartItem[]> => {
    try {
      const res = await fetch(`${API}/api/toi/giohang`, {
        headers: getAuthHeaders(),
        cache: "no-store",
      });
      if (!res.ok) return [];
      const j: unknown = await res.json();
      
      let rawData: unknown[] = [];
      if (Array.isArray(j)) {
         rawData = j;
      } else if (j && typeof j === 'object' && 'data' in j && Array.isArray((j as { data: unknown[] }).data)) {
         rawData = (j as { data: unknown[] }).data;
      }

      return rawData.map(mapServerDataToCartItem);
    } catch (e) {
      console.error("Lỗi load server cart:", e);
      return [];
    }
  }, [API, getAuthHeaders, mapServerDataToCartItem]);

  // --- LOCAL STORAGE HELPERS ---
  const loadLocalCart = useCallback((): CartItem[] => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
    } catch { return []; }
  }, []);

  const saveLocalCart = useCallback((cart: CartItem[]) => {
    if (typeof window === "undefined") return;
    try { localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart)); } catch {}
  }, []);

  const clearLocalCart = useCallback(() => {
    if (typeof window === "undefined") return;
    try { localStorage.removeItem(CART_STORAGE_KEY); } catch { }
  }, []);

  // --- SYNC LOGIC ---
  const syncLocalToServer = useCallback(async () => {
    const localItems = loadLocalCart();
    if (localItems.length === 0) return;
    setLoading(true);
    try {
      for (const item of localItems) {
        await fetch(`${API}/api/toi/giohang`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            id_bienthe: item.id_bienthe,
            soluong: item.quantity,
          }),
        }).catch(() => {});
      }
      clearLocalCart();
      const serverCart = await loadServerCart();
      setItems(serverCart);
      try { 
          const count = serverCart.reduce((s, it) => s + (Number(it.quantity) || 0), 0);
          window.dispatchEvent(new CustomEvent("cart:updated", { detail: { count } })); 
      } catch { }
    } finally { setLoading(false); }
  }, [API, getAuthHeaders, loadLocalCart, clearLocalCart, loadServerCart]);

  // --- INIT EFFECT ---
  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      if (isLoggedIn) {
        const serverCart = await loadServerCart();
        setItems(serverCart);
      } else {
        const localCart = loadLocalCart();
        setItems(localCart);
      }
    } finally { setLoading(false); }
  }, [isLoggedIn, loadServerCart, loadLocalCart]);

  useEffect(() => {
    let mounted = true;
    (async () => {
        if (isLoggedIn) {
            const localItems = loadLocalCart();
            if (localItems.length > 0 && !hasSyncedRef.current) {
                hasSyncedRef.current = true;
                await syncLocalToServer();
            } else if (localItems.length === 0) {
                if (mounted) await fetchCart();
            }
        } else {
            hasSyncedRef.current = false;
            if (mounted) await fetchCart();
        }
    })();
    return () => { mounted = false; };
  }, [isLoggedIn, syncLocalToServer, fetchCart, loadLocalCart]);

  useEffect(() => {
    const onUpdated = () => fetchCart();
    window.addEventListener("cart:updated", onUpdated);
    return () => window.removeEventListener("cart:updated", onUpdated);
  }, [fetchCart]);

  // --- ACTIONS ---
  const addToCart = useCallback(async (product: AddToCartInput, quantity = 1) => {
    const id_bienthe = product.id_bienthe ?? product.id;
    if (!id_bienthe) return;
    
    setLoading(true);
    try {
      if (isLoggedIn) {
        const res = await fetch(`${API}/api/toi/giohang`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ 
              id_bienthe: String(id_bienthe), 
              soluong: quantity 
          }),
        });
        if (res.ok) {
            const serverCart = await loadServerCart();
            setItems(serverCart);
            const count = serverCart.reduce((s, it) => s + (Number(it.quantity) || 0), 0);
            window.dispatchEvent(new CustomEvent("cart:updated", { detail: { count } }));
        }
      } else {
        const localCart = loadLocalCart();
        const existingIndex = localCart.findIndex(i => i.id_bienthe == id_bienthe);
        
        const priceVal = typeof product.gia === 'number' ? product.gia : (product.gia?.current ?? 0);
        const displayItem: CartItem = {
            id_giohang: `local_${Date.now()}`,
            id_bienthe: id_bienthe,
            quantity: quantity,
            product: {
                id: id_bienthe,
                ten: product.ten ?? "Sản phẩm",
                mediaurl: product.hinhanh ?? "/assets/images/thumbs/placeholder.png",
                gia: { current: Number(priceVal) }
            }
        };

        if (existingIndex >= 0) localCart[existingIndex].quantity += quantity;
        else localCart.push(displayItem);
        
        saveLocalCart(localCart);
        setItems(localCart);
        const count = localCart.reduce((s, it) => s + (Number(it.quantity) || 0), 0);
        window.dispatchEvent(new CustomEvent("cart:updated", { detail: { count } }));
      }
    } finally { setLoading(false); }
  }, [isLoggedIn, API, getAuthHeaders, loadServerCart, loadLocalCart, saveLocalCart]);

  const updateQuantity = useCallback(async (id_giohang: number | string, quantity: number) => {
    if (quantity < 1) return;
    setItems(prev => prev.map(it => it.id_giohang === id_giohang ? { ...it, quantity } : it));

    if (isLoggedIn) {
      await fetch(`${API}/api/toi/giohang/${id_giohang}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ soluong: quantity }),
      }).catch(() => fetchCart());
    } else {
      const local = loadLocalCart();
      const updated = local.map(it => it.id_giohang === id_giohang ? { ...it, quantity } : it);
      saveLocalCart(updated);
    }
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent("cart:updated"));
  }, [isLoggedIn, API, getAuthHeaders, fetchCart, loadLocalCart, saveLocalCart]);

  const removeItem = useCallback(async (id_giohang: number | string) => {
    setItems(prev => prev.filter(it => it.id_giohang !== id_giohang));
    if (isLoggedIn) {
      await fetch(`${API}/api/toi/giohang/${id_giohang}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      }).catch(() => fetchCart());
    } else {
      const local = loadLocalCart();
      const updated = local.filter(it => it.id_giohang !== id_giohang);
      saveLocalCart(updated);
    }
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent("cart:updated"));
  }, [isLoggedIn, API, getAuthHeaders, fetchCart, loadLocalCart, saveLocalCart]);

  const clearCart = useCallback(() => {
    setItems([]);
    if (!isLoggedIn) clearLocalCart();
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent("cart:updated", { detail: { count: 0 } }));
  }, [isLoggedIn, clearLocalCart]);

  // ========================================================================
  // 3. VOUCHER LOGIC
  // ========================================================================

  const subtotal = items.reduce((sum, it) => {
    const pPrice = it.product?.gia?.current; 
    const price = Number(pPrice || 0);
    const qty = Number(it.quantity) || 0;
    return sum + price * qty;
  }, 0);

  const applyVoucher = useCallback((voucher: Coupon) => {
    if (voucher.min_order_value && subtotal < voucher.min_order_value) {
        alert(`Đơn hàng chưa đạt giá trị tối thiểu ${voucher.min_order_value.toLocaleString("vi-VN")}đ`);
        return;
    }
    setAppliedVoucher(voucher);
  }, [subtotal]);

  // Lấy danh sách voucher
  const fetchVouchers = useCallback(async () => {
    try {
        const res = await fetch(`${API}/api/ma-giam-gia`, {
            headers: getAuthHeaders(),
            cache: "no-store"
        });
        
        if (res.ok) {
            const json: unknown = await res.json();
            let list: unknown[] = [];
            if (json && typeof json === 'object' && 'data' in json && Array.isArray((json as { data: unknown[] }).data)) {
                list = (json as { data: unknown[] }).data;
            } else if (Array.isArray(json)) {
                list = json;
            }
            
            // SỬA: Filter trước, Map sau để tránh any
            const activeVouchers = (list as ServerVoucherRaw[])
                .filter(raw => raw.trangthai === "Hoạt động")
                .map(raw => {
                    const minVal = parseMinOrderValue(raw.dieukien, raw.mota);
                    return {
                        id: raw.id,
                        code: String(raw.magiamgia ?? raw.code ?? "UNKNOWN"),
                        giatri: Number(raw.giatri ?? raw.amount ?? 0),
                        mota: raw.mota ?? raw.description ?? "Mã giảm giá",
                        min_order_value: minVal
                    } as Coupon;
                });

            setAvailableVouchers(activeVouchers);
        }
    } catch (e) {
        console.error("Lỗi lấy danh sách voucher:", e);
    }
  }, [API, getAuthHeaders]);

  useEffect(() => { fetchVouchers(); }, [fetchVouchers]);

  const applyVoucherByCode = useCallback(async (code: string) => {
    if (!code) return;
    setLoading(true);
    try {
        await fetchVouchers();
        
        const res = await fetch(`${API}/api/ma-giam-gia`, { headers: getAuthHeaders() });
        const json = await res.json();
        
        let list: unknown[] = [];
        if (json && typeof json === 'object' && 'data' in json) {
             list = (json as { data: unknown[] }).data;
        } else if (Array.isArray(json)) {
             list = json;
        }

        // SỬA: Ép kiểu an toàn
        const foundRaw = (list as ServerVoucherRaw[]).find((raw) => {
             return String(raw.magiamgia) === code && raw.trangthai === "Hoạt động";
        });

        if (foundRaw) {
            const minVal = parseMinOrderValue(foundRaw.dieukien, foundRaw.mota);
            const coupon: Coupon = {
                id: foundRaw.id,
                code: String(foundRaw.magiamgia),
                giatri: Number(foundRaw.giatri),
                mota: foundRaw.mota,
                min_order_value: minVal
            };
            applyVoucher(coupon);
        } else {
            alert("Mã giảm giá không tồn tại hoặc chưa kích hoạt.");
        }
    } catch (e) {
        console.error(e);
        alert("Lỗi khi kiểm tra mã giảm giá.");
    } finally {
        setLoading(false);
    }
  }, [API, getAuthHeaders, fetchVouchers, applyVoucher]);

  const removeVoucher = useCallback(() => setAppliedVoucher(null), []);

  const discountAmount = appliedVoucher ? appliedVoucher.giatri : 0;
  const total = Math.max(0, subtotal - discountAmount);
  const totalItems = items.reduce((sum, it) => sum + (Number(it.quantity) || 0), 0);

  return {
    items, loading, addToCart, updateQuantity, removeItem, clearCart, refreshCart: fetchCart,
    subtotal, 
    totalItems,
    appliedVoucher, 
    applyVoucher, 
    applyVoucherByCode,
    removeVoucher, 
    discountAmount, 
    total,
    availableVouchers 
  };
}