"use client";
import { useEffect } from "react";

export default function CounterBoot() {
  useEffect(() => {
    (async () => {
      const { default: counterUp } = await import("counterup2");

      const els = document.querySelectorAll<HTMLElement>(".counter");
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach(({ isIntersecting, target }) => {
            const el = target as HTMLElement;
            if (isIntersecting && !el.classList.contains("is-visible")) {
              counterUp(el, { duration: 2000, delay: 16 });
              el.classList.add("is-visible");
            }
          });
        },
        { threshold: 1 }
      );

      els.forEach((el) => io.observe(el));
    })();
  }, []);

  return null;
}
