// src/types/window.d.ts
export {};

declare global {
  interface Window {
    /** Điểm neo cho hiệu ứng fly-to-cart; được set bởi FullHeader hoặc auto-init bằng selector */
    __cart_icon_anchor__?: HTMLElement | null;
  }
}
