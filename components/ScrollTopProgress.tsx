"use client";
import React, { useEffect, useMemo, useState } from "react";

export default function ScrollTopProgress() {
  const [progress, setProgress] = useState(0);
  const radius = 49;
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const pct = docHeight > 0 ? Math.min(1, scrollTop / docHeight) : 0;
      setProgress(pct);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dashoffset = useMemo(() => circumference * (1 - progress), [progress, circumference]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button aria-label="Scroll to top" onClick={scrollToTop} className="progress-wrap" style={{display: "inline-block"}}>
      <svg className="progress-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102">
        <path
          d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
        />
      </svg>
    </button>
  );
}
