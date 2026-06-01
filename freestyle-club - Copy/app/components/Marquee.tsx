"use client";

import { useEffect, useRef, useState } from "react";

const ITEMS = [
  "HOUSE",
  "RNB",
  "HIP-HOP",
  "DISCO",
  "SEPAREI",
  "ŽIVA SVIRKA",
  "10+ GODINA",
  "SAVA · BEOGRAD",
];

const DIAMOND_COLORS = ["#22e1ff", "#ff2e9a", "#a855f7"];

export default function Marquee() {
  const ref = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);

  // Pauziraj traku kada nije u vidokrugu (štedi GPU → glađe skrolovanje)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setPaused(!entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={`marquee relative border-y border-white/10 bg-ink/40 py-5 ${
        paused ? "marquee-paused" : ""
      }`}
      aria-label="House, RnB, Hip-Hop, Disco — Freestyler"
    >
      {[0, 1].map((copy) => (
        <div
          key={copy}
          className="marquee__group"
          aria-hidden={copy === 1 ? true : undefined}
        >
          {ITEMS.map((word, i) => (
            <div key={i} className="flex items-center gap-8">
              <span className="font-display text-xl font-extrabold uppercase tracking-wide text-white/90 text-glow-soft sm:text-2xl">
                {word}
              </span>
              <span
                className="text-lg"
                style={{ color: DIAMOND_COLORS[i % DIAMOND_COLORS.length] }}
              >
                ◆
              </span>
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}
