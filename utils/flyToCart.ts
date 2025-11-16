// utils/flyToCart.ts
// Sạch any + có fallback tìm điểm đích theo selector

// Cho TS biết window có thuộc tính này
declare global {
  interface Window {
    __cart_icon_anchor__?: HTMLElement | null;
  }
}

const DEFAULT_SELECTOR = "[data-cart-icon], #cart-icon, .js-cart-icon";

export function setCartAnchor(el: HTMLElement | null): void {
  if (typeof window === "undefined") return;
  window.__cart_icon_anchor__ = el;
}

function getCartAnchor(): HTMLElement | null {
  if (typeof window === "undefined") return null;

  // Ưu tiên anchor đã được đăng ký
  const saved = window.__cart_icon_anchor__;
  if (saved && document.contains(saved)) return saved;

  // Fallback: tự tìm theo selector
  const found = document.querySelector<HTMLElement>(DEFAULT_SELECTOR);
  if (found) {
    window.__cart_icon_anchor__ = found;
    return found;
  }
  return null;
}

/**
 * Bay một "bản sao nhỏ" của startEl tới icon giỏ hàng.
 * @param startEl: phần tử gốc (ví dụ wrapper của ảnh sản phẩm)
 * @param opts.duration: thời gian ms (mặc định 600)
 * @param opts.scale: tỉ lệ thu nhỏ (mặc định 0.3)
 */
export function flyToCart(
  startEl: HTMLElement | null,
  opts?: { duration?: number; scale?: number }
): void {
  try {
    const anchor = getCartAnchor();
    if (!startEl || !anchor) return;

    const duration = Math.max(200, Math.min(1500, Math.round(opts?.duration ?? 600)));
    const scale = Math.max(0.1, Math.min(1, opts?.scale ?? 0.3));

    const s = startEl.getBoundingClientRect();
    const e = anchor.getBoundingClientRect();

    // Dịch chuyển từ tâm -> tâm
    const dx = e.left + e.width / 2 - (s.left + s.width / 2);
    const dy = e.top + e.height / 2 - (s.top + s.height / 2);

    const ghost = startEl.cloneNode(true) as HTMLElement;
    ghost.style.position = "fixed";
    ghost.style.pointerEvents = "none";
    ghost.style.margin = "0";
    ghost.style.zIndex = "9999";
    ghost.style.left = `${s.left}px`;
    ghost.style.top = `${s.top}px`;
    ghost.style.width = `${s.width}px`;
    ghost.style.height = `${s.height}px`;
    ghost.style.transformOrigin = "center center";
    ghost.style.transition = `transform ${duration}ms cubic-bezier(.22,.61,.36,1), opacity ${duration}ms`;
    document.body.appendChild(ghost);

    requestAnimationFrame(() => {
      ghost.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
      ghost.style.opacity = "0.2";
    });

    const cleanup = () => {
      try { ghost.remove(); } catch {}
      ghost.removeEventListener("transitionend", cleanup);
    };
    ghost.addEventListener("transitionend", cleanup);
    // Phòng khi transitionend không bắn
    setTimeout(cleanup, duration + 120);
  } catch {
    // noop
  }
}

/** Tuỳ chọn: auto tìm và lưu anchor theo selector tùy ý */
export function initCartAnchorBySelector(selector: string = DEFAULT_SELECTOR): void {
  const el = document.querySelector<HTMLElement>(selector);
  if (el) setCartAnchor(el);
}
