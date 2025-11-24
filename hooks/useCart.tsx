"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./useAuth";
import Cookies from "js-cookie";

const CART_STORAGE_KEY = "marketpro_cart";


export type Gia = { current?: number; before_discount?: number };


export type CartItem = {
  id_bienthesp: number | string;
  quantity: number;
  gia?: Gia;
  product?: {
    id?: number | string;
    ten?: string;
    mediaurl?: string;
    gia?: Gia;
    category?: string;
    ratingAverage?: number;
    ratingCount?: number;
  };
};

export type ProductInput = {
  id?: number | string;
  id_bienthesp?: number | string;
  ten?: string;
  name?: string;
  mediaurl?: string;
  hinhanh?: string;
  image?: string;
  price?: number;
  gia?: number | Gia;
  category?: string;
  [key: string]: unknown; 
};

// ==========================================
// 2. SERVER TYPES (Dữ liệu thô từ API)
// ==========================================

interface ServerPriceObj {
  current?: number;
  before_discount?: number;
}

interface ServerProductRaw {
  id?: number | string;
  ten?: string;
  name?: string;
  mediaurl?: string;
  hinhanh?: string;
  image?: string;
  gia?: ServerPriceObj | number;
  price?: number;
  selling_price?: number;
  giagoc?: number;
  category?: string;
  danhmuc?: { ten?: string };
  ratingAverage?: number;
  danhgia_tb?: number;
  ratingCount?: number;
  luot_danhgia?: number;
}

interface ServerCartItemRaw {
  id?: number | string;
  id_bienthesp?: number | string;
  quantity?: number;
  soluong?: number;
  gia?: number | ServerPriceObj;
  giagoc?: number;
  
  // Các trường lồng nhau có thể xuất hiện tùy API
  product?: ServerProductRaw;
  sanpham?: ServerProductRaw;
  bienthe?: {
    id?: number | string;
    sanpham?: ServerProductRaw;
  };
}

// ==========================================
// 3. CONTEXT TYPE
// ==========================================

type CartContextType = {
  items: CartItem[];
  loading: boolean;
  addToCart: (product: ProductInput, quantity?: number) => Promise<void>;
  updateQuantity: (id_bienthesp: number | string, quantity: number) => Promise<void>;
  removeItem: (id_bienthesp: number | string) => Promise<void>;
  refreshCart: () => Promise<void>;
  clearCart: () => void;
};

// ==========================================
// 4. HOOK LOGIC
// ==========================================

export function useCart() {
  const { isLoggedIn } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
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

  // --- HELPER: Map dữ liệu Server -> CartItem ---
  // Input là unknown[] để an toàn, sau đó ép kiểu cục bộ
  const mapServerCartToLocal = useCallback((serverData: unknown): CartItem[] => {
    if (!Array.isArray(serverData)) return [];

    return serverData.map((item: unknown) => {
      // Type Assertion an toàn tại đây
      const sItem = item as ServerCartItemRaw;
      
      // 1. ID
      const id_bienthesp = sItem.id_bienthesp ?? sItem.id ?? "unknown";
      
      // 2. Số lượng
      const quantity = Number(sItem.quantity ?? sItem.soluong ?? 1);

      // 3. Tìm object sản phẩm nguồn
      const pSource = sItem.product || sItem.sanpham || sItem.bienthe?.sanpham;

      // 4. Xử lý giá (Server có thể trả về number hoặc object)
      const rawPrice = sItem.gia ?? pSource?.gia ?? pSource?.price ?? pSource?.selling_price;
      const currentPrice = typeof rawPrice === 'object' && rawPrice !== null 
        ? (rawPrice.current ?? 0) 
        : Number(rawPrice || 0);
      
      const rawOrigin = pSource?.gia && typeof pSource.gia === 'object' 
        ? pSource.gia.before_discount 
        : (sItem.giagoc ?? pSource?.giagoc);
      const originPrice = Number(rawOrigin || 0);

      // 5. Rating
      const ratingAvg = Number(pSource?.ratingAverage ?? pSource?.danhgia_tb ?? 5);
      const ratingCnt = Number(pSource?.ratingCount ?? pSource?.luot_danhgia ?? 0);

      return {
        id_bienthesp,
        quantity,
        gia: { current: currentPrice, before_discount: originPrice },
        product: pSource ? {
          id: pSource.id ?? id_bienthesp,
          ten: pSource.ten ?? pSource.name ?? "Đang tải...",
          mediaurl: pSource.mediaurl ?? pSource.hinhanh ?? pSource.image ?? "/assets/images/thumbs/placeholder.png",
          category: pSource.category ?? pSource.danhmuc?.ten ?? "Sản phẩm",
          ratingAverage: ratingAvg,
          ratingCount: ratingCnt,
          gia: {
            current: currentPrice,
            before_discount: originPrice
          }
        } : undefined
      };
    });
  }, []);

  // 1. Load Cart
  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      if (isLoggedIn) {
        // --- SERVER ---
        const res = await fetch(`${API}/api/toi/giohang`, {
          headers: getAuthHeaders(),
          cache: "no-store",
        });
        if (res.ok) {
          const json: unknown = await res.json();
          // Kiểm tra an toàn trước khi map
          let rawData: unknown[] = [];
          if (Array.isArray(json)) {
            rawData = json;
          } else if (json && typeof json === 'object' && 'data' in json && Array.isArray((json as { data: unknown[] }).data)) {
            rawData = (json as { data: unknown[] }).data;
          }
          
          setItems(mapServerCartToLocal(rawData));
        }
      } else {
        // --- LOCAL ---
        if (typeof window === "undefined") return;
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        if (saved) {
          const parsed: unknown = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setItems(parsed as CartItem[]);
          }
        }
      }
    } catch (err) {
      console.error("Lỗi tải giỏ hàng:", err);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, API, getAuthHeaders, mapServerCartToLocal]);

  // 2. Sync Local -> Server
  useEffect(() => {
    if (isLoggedIn && !hasSyncedRef.current) {
      const local = localStorage.getItem(CART_STORAGE_KEY);
      if (local) {
        try {
          const localItems: unknown = JSON.parse(local);
          if (Array.isArray(localItems) && localItems.length > 0) {
            (async () => {
              for (const item of localItems as CartItem[]) {
                await fetch(`${API}/api/toi/giohang`, {
                  method: "POST",
                  headers: getAuthHeaders(),
                  body: JSON.stringify({
                    id_bienthesp: item.id_bienthesp,
                    quantity: item.quantity
                  })
                }).catch(() => {});
              }
              localStorage.removeItem(CART_STORAGE_KEY);
              fetchCart();
            })();
          }
        } catch (e) { console.error(e); }
        hasSyncedRef.current = true;
      }
    } else if (!isLoggedIn) {
      hasSyncedRef.current = false;
      fetchCart();
    }
  }, [isLoggedIn, fetchCart, API, getAuthHeaders]);

  // 3. Add Item
  const addToCart = useCallback(async (product: ProductInput, quantity = 1) => {
    const id_bienthesp = product.id_bienthesp ?? product.id;
    if (!id_bienthesp) return;
    
    if (isLoggedIn) {
      await fetch(`${API}/api/toi/giohang`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ id_bienthesp, quantity }),
      });
      fetchCart();
    } else {
      setItems(prev => {
        const existIdx = prev.findIndex(i => i.id_bienthesp === id_bienthesp);
        const next = [...prev];
        
        
        const priceVal = typeof product.gia === 'number' ? product.gia : (product.gia?.current ?? product.price ?? 0);

        const displayItem: CartItem = {
            id_bienthesp,
            quantity,
            product: {
                id: id_bienthesp,
                ten: product.ten ?? product.name ?? "Sản phẩm",
                mediaurl: product.mediaurl ?? product.hinhanh ?? "/assets/images/thumbs/placeholder.png",
                category: product.category ?? "Sản phẩm",
                gia: { current: Number(priceVal) }
            }
        };

        if (existIdx >= 0) {
          next[existIdx].quantity += quantity;
        } else {
          next.push(displayItem);
        }
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    }
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent("cart:updated"));
  }, [isLoggedIn, API, getAuthHeaders, fetchCart]);

  // 4. Update Quantity
  const updateQuantity = useCallback(async (id_bienthesp: number | string, quantity: number) => {
    if (quantity < 1) return;

    setItems(prev => prev.map(it => it.id_bienthesp === id_bienthesp ? { ...it, quantity } : it));

    if (isLoggedIn) {
      await fetch(`${API}/api/toi/giohang/${id_bienthesp}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ quantity }),
      }).catch(() => fetchCart());
    } else {
      const currentString = localStorage.getItem(CART_STORAGE_KEY);
      if (currentString) {
          const current = JSON.parse(currentString) as CartItem[];
          const next = current.map(it => it.id_bienthesp === id_bienthesp ? { ...it, quantity } : it);
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
      }
    }
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent("cart:updated"));
  }, [isLoggedIn, API, getAuthHeaders, fetchCart]);

  // 5. Remove Item
  const removeItem = useCallback(async (id_bienthesp: number | string) => {
    setItems(prev => prev.filter(it => it.id_bienthesp !== id_bienthesp));

    if (isLoggedIn) {
      await fetch(`${API}/api/toi/giohang/${id_bienthesp}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      }).catch(() => fetchCart());
    } else {
      const currentString = localStorage.getItem(CART_STORAGE_KEY);
      if (currentString) {
          const current = JSON.parse(currentString) as CartItem[];
          const next = current.filter(it => it.id_bienthesp !== id_bienthesp);
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
      }
    }
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent("cart:updated"));
  }, [isLoggedIn, API, getAuthHeaders, fetchCart]);

  const clearCart = useCallback(() => {
    setItems([]);
    if (!isLoggedIn) localStorage.removeItem(CART_STORAGE_KEY);
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent("cart:updated", { detail: { count: 0 } }));
  }, [isLoggedIn]);

  return {
    items,
    loading,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart: fetchCart
  };
}