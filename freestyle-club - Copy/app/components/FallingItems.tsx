"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/* ──────────────────────────────────────────────────────────────────────────
 *  Dekorativni sloj: klupske stvari (SVG, neon glow) padaju odozgo — neprekidno.
 *  Bez emoji-ja. Optimizovano: transform-only + pauza kad hero nije u vidokrugu.
 * ────────────────────────────────────────────────────────────────────────── */

type ShapeKind =
  | "bottle"
  | "champagne"
  | "sparkler"
  | "martini"
  | "disco"
  | "star";

const SHAPES: ShapeKind[] = [
  "bottle",
  "sparkler",
  "martini",
  "disco",
  "star",
  "champagne",
  "sparkler",
  "star",
  "martini",
  "bottle",
  "disco",
  "star",
];

const COLORS = ["#22e1ff", "#ff2e9a", "#a855f7", "#ff4fd8", "#7c3aed"];

// Deterministička raspodela (bez Math.random u renderu → nema hydration mismatch-a)
const LEFTS = [5, 16, 27, 38, 49, 60, 71, 82, 92, 11, 44, 77];
const SIZES = [46, 58, 40, 64, 50, 42, 60, 48, 54, 38, 56, 50];

/**
 * OPCIJA: prave PNG flaše (transparentne).
 * Stavi fajlove u /public i upiši njihova imena ovde — automatski zamenjuju
 * SVG flaše u animaciji. Ostavi prazno za čisti SVG.
 */
const BOTTLE_PNGS: string[] = [
  // "/bottle-1.png",
];

function Shape({ kind, size }: { kind: ShapeKind; size: number }) {
  const common = {
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
  };

  switch (kind) {
    case "bottle":
      return (
        <svg width={size * 0.42} height={size} viewBox="0 0 24 60">
          <path
            d="M9 3h6v5c0 2.2 3 3.8 3 9v36a4 4 0 0 1-4 4h-6a4 4 0 0 1-4-4V17c0-5.2 3-6.8 3-9V3z"
            {...common}
          />
          <path d="M6 30h12" {...common} />
          <path d="M9 3h6" {...common} strokeWidth={2.4} />
        </svg>
      );
    case "champagne":
      return (
        <svg width={size * 0.38} height={size} viewBox="0 0 20 60">
          <path d="M7 4h6l-1 22a4 4 0 0 1-8 0L7 4z" {...common} />
          <path d="M10 30v22" {...common} />
          <path d="M5 56h10" {...common} />
        </svg>
      );
    case "sparkler":
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <path d="M10 40 32 18" {...common} strokeWidth={2.4} />
          <circle cx="35" cy="15" r="4" fill="currentColor" />
          <path
            d="M35 4v6M35 20v6M24 15h6M40 15h6M27 7l4 4M39 19l4 4M43 7l-4 4M31 19l-4 4"
            {...common}
            strokeWidth={1.6}
          />
        </svg>
      );
    case "martini":
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <path d="M8 10h32L24 30 8 10z" {...common} />
          <path d="M24 30v12M14 44h20" {...common} />
          <circle cx="30" cy="20" r="2.4" fill="currentColor" />
          <path d="M30 20 36 8" {...common} strokeWidth={1.4} />
        </svg>
      );
    case "disco":
      return (
        <svg width={size} height={size} viewBox="0 0 48 48">
          <path d="M24 4v6" {...common} />
          <circle cx="24" cy="28" r="15" {...common} />
          <path
            d="M9 28h30M24 13v30M13 18c7 5 15 5 22 0M13 38c7-5 15-5 22 0M18 14c-2 9-2 19 0 28M30 14c2 9 2 19 0 28"
            {...common}
            strokeWidth={1.3}
          />
        </svg>
      );
    case "star":
      return (
        <svg width={size * 0.8} height={size * 0.8} viewBox="0 0 24 24">
          <path
            d="M12 2l2.6 6.6L21 11l-6.4 2.4L12 20l-2.6-6.6L3 11l6.4-2.4L12 2z"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinejoin="round"
            fill="currentColor"
            fillOpacity={0.18}
          />
        </svg>
      );
  }
}

export default function FallingItems() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils.toArray<HTMLElement>(".falling-item");
        const fallTo = () => window.innerHeight + 240;
        const anims: gsap.core.Animation[] = [];

        items.forEach((el) => {
          const dur = gsap.utils.random(5, 9);

          const tl = gsap
            .timeline({
              repeat: -1,
              delay: gsap.utils.random(0, 6),
              repeatRefresh: true,
            })
            .set(el, {
              y: -240,
              rotation: () => gsap.utils.random(-80, 80),
              autoAlpha: 0,
            })
            .to(el, { autoAlpha: 0.8, duration: 0.8 }, 0)
            .to(
              el,
              {
                y: fallTo,
                rotation: "+=" + gsap.utils.random(160, 500),
                duration: dur,
                ease: "none",
              },
              0,
            )
            .to(el, { autoAlpha: 0, duration: 0.9 }, dur - 0.9);
          anims.push(tl);

          anims.push(
            gsap.to(el, {
              x: gsap.utils.random(-60, 60),
              duration: gsap.utils.random(2.5, 4.5),
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            }),
          );
        });

        // Pauziraj sve kad hero (ovaj sloj) nije u vidokrugu
        const st = ScrollTrigger.create({
          trigger: scope.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) =>
            anims.forEach((a) => (self.isActive ? a.play() : a.pause())),
        });

        return () => {
          st.kill();
          anims.forEach((a) => a.kill());
        };
      });

      return () => mm.revert();
    },
    { scope },
  );

  return (
    <div
      ref={scope}
      className="falling-layer pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {SHAPES.map((kind, i) => {
        const color = COLORS[i % COLORS.length];
        const usePng =
          (kind === "bottle" || kind === "champagne") && BOTTLE_PNGS.length > 0;
        const pngSrc = usePng ? BOTTLE_PNGS[i % BOTTLE_PNGS.length] : null;

        return (
          <span
            key={i}
            className="falling-item"
            style={{
              left: `${LEFTS[i]}%`,
              color,
              filter: `drop-shadow(0 0 8px ${color})`,
            }}
          >
            {pngSrc ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={pngSrc}
                alt=""
                style={{ width: SIZES[i] * 0.7, height: "auto" }}
              />
            ) : (
              <Shape kind={kind} size={SIZES[i]} />
            )}
          </span>
        );
      })}
    </div>
  );
}
