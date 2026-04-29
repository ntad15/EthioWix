"use client";

import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react";

export function Reveal({
  children,
  delay = 0,
  y = 24,
  style,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    io.observe(el);
    const rect = el.getBoundingClientRect();
    const timer =
      rect.top < window.innerHeight
        ? window.setTimeout(() => setShown(true), 0)
        : null;
    return () => {
      if (timer) window.clearTimeout(timer);
      io.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        ...style,
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : `translateY(${y}px)`,
        transition: `opacity 700ms cubic-bezier(.2,.7,.2,1) ${delay}ms, transform 700ms cubic-bezier(.2,.7,.2,1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

export function ParallaxBg({
  src,
  overlay = true,
  strength = 0.18,
  children,
  style,
  className,
}: {
  src: string;
  overlay?: boolean;
  strength?: number;
  children?: ReactNode;
  style?: CSSProperties;
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const bg = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wEl = wrap.current;
    const bEl = bg.current;
    if (!wEl || !bEl) return;
    const onScroll = () => {
      const r = wEl.getBoundingClientRect();
      const y = r.top * -strength;
      bEl.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) scale(1.08)`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [strength]);

  return (
    <div ref={wrap} className={className} style={{ position: "relative", overflow: "hidden", ...style }}>
      <div
        ref={bg}
        style={{
          position: "absolute",
          inset: "-8% -2%",
          backgroundImage: `url(${src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          willChange: "transform",
        }}
      />
      {overlay && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.55) 100%)",
          }}
        />
      )}
      <div style={{ position: "relative", zIndex: 1, height: "100%" }}>
        {children}
      </div>
    </div>
  );
}

export function Marquee({
  items,
  color = "#fff",
  bg = "transparent",
  font,
  speed = 60,
  separator = "·",
}: {
  items: string[];
  color?: string;
  bg?: string;
  font?: string;
  speed?: number;
  separator?: string;
}) {
  const inner = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);

  useEffect(() => {
    if (inner.current) setW(inner.current.scrollWidth / 2);
  }, [items]);

  const dur = w > 0 ? Math.max(20, w / speed) : 30;
  const repeated = [...items, ...items];

  return (
    <div
      style={{
        overflow: "hidden",
        background: bg,
        color,
        fontFamily: font,
        padding: "14px 0",
      }}
    >
      <style>{`@keyframes fs-marq-scroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }`}</style>
      <div
        ref={inner}
        style={{
          display: "inline-flex",
          whiteSpace: "nowrap",
          animation: `fs-marq-scroll ${dur}s linear infinite`,
        }}
      >
        {repeated.map((t, i) => (
          <span
            key={i}
            style={{
              padding: "0 28px",
              fontSize: 14,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              display: "inline-flex",
              alignItems: "center",
              gap: 28,
            }}
          >
            {t}
            <span style={{ opacity: 0.4 }}>{separator}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function HoverLift({
  children,
  lift = 6,
  style,
}: {
  children: ReactNode;
  lift?: number;
  style?: CSSProperties;
}) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        transition:
          "transform 360ms cubic-bezier(.2,.7,.2,1), box-shadow 360ms",
        transform: hover ? `translateY(-${lift}px)` : "translateY(0)",
        boxShadow: hover
          ? "0 18px 40px -20px rgba(0,0,0,0.25)"
          : "0 0 0 rgba(0,0,0,0)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
