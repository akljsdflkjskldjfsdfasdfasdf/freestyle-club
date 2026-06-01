"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { ReservationTypeId } from "@/lib/reservations-config";
import { useReservation } from "./ReservationProvider";

gsap.registerPlugin(ScrollTrigger);

const COLORS = {
  sank: "#22e1ff",
  barski_sto: "#ff2e9a",
  separe: "#a855f7",
} as const;

interface Spot {
  id: string;
  kind: "rect" | "circle";
  x: number;
  y: number;
  w?: number;
  h?: number;
  r?: number;
  /** Pun naziv mesta (ide u rezervaciju). */
  label: string;
  /** Kratak prikaz na samoj skici. */
  short: string;
  /** Nivo separea. */
  level?: string;
  tip: ReservationTypeId;
  paket: string;
  price: string;
}

const CENTER = { x: 410, y: 262 };

// Centralni šank
const SANK: Spot = {
  id: "sank",
  kind: "rect",
  x: 348,
  y: 217,
  w: 124,
  h: 90,
  label: "Centralni šank",
  short: "ŠANK",
  tip: "sank",
  paket: "sank-ulaz",
  price: "od 500 RSD / osobi",
};

// Barski stolovi u krug oko šanka
const TABLES: Spot[] = Array.from({ length: 8 }, (_, i) => {
  const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
  return {
    id: `bs${i + 1}`,
    kind: "circle",
    x: Math.round(CENTER.x + Math.cos(a) * 172),
    y: Math.round(CENTER.y + Math.sin(a) * 104),
    r: 18,
    label: `Barski sto ${i + 1}`,
    short: `${i + 1}`,
    tip: "barski_sto",
    paket: "barski-standard",
    price: "od 12.000 RSD",
  };
});

// Separei uz ivice (premium ka pramcu — desno)
const SEPARE_META: { level: string; paket: string; price: string }[] = [
  { level: "Sofa", paket: "separe-sofa", price: "od 35.000 RSD" },
  { level: "VIP Sofa", paket: "separe-vip-sofa", price: "od 60.000 RSD" },
  { level: "Ultra VIP", paket: "separe-ultra-vip", price: "od 120.000 RSD" },
];
const sofa = SEPARE_META[0];
const vip = SEPARE_META[1];
const ultra = SEPARE_META[2];

const SEPARE_X = [110, 258, 406, 554, 700];
const SEPARE_LEVELS = [sofa, sofa, sofa, vip, ultra];

const SEPARES: Spot[] = [
  ...SEPARE_X.map((x, i) => ({ x, y: 92, n: i + 1, m: SEPARE_LEVELS[i] })),
  ...SEPARE_X.map((x, i) => ({ x, y: 432, n: i + 6, m: SEPARE_LEVELS[i] })),
].map(({ x, y, n, m }) => ({
  id: `se${n}`,
  kind: "rect" as const,
  x: x - 50,
  y: y - 24,
  w: 100,
  h: 48,
  label: `Separe ${n}`,
  short: `SEPARE ${n}`,
  level: m.level,
  tip: "separe" as const,
  paket: m.paket,
  price: m.price,
}));

const ALL_SPOTS: Spot[] = [SANK, ...TABLES, ...SEPARES];

const TYPE_NAME: Record<ReservationTypeId, string> = {
  sank: "Šank",
  barski_sto: "Barski sto",
  separe: "Separe",
};

export default function ClubMap() {
  const scope = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState<Spot | null>(null);
  const { open } = useReservation();

  const pick = (s: Spot) =>
    open(s.tip, {
      paket: s.paket,
      spot: s.level ? `${s.label} (${s.level})` : s.label,
    });

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".map-reveal", {
          y: 36,
          autoAlpha: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: scope.current, start: "top 75%" },
        });
        gsap.from(".club-spot", {
          scale: 0.5,
          autoAlpha: 0,
          transformOrigin: "center",
          duration: 0.5,
          stagger: 0.02,
          ease: "back.out(1.7)",
          scrollTrigger: { trigger: ".club-svg", start: "top 80%" },
        });
      });
      return () => mm.revert();
    },
    { scope },
  );

  const caption = hovered
    ? {
        title: hovered.level
          ? `${hovered.label} · ${hovered.level}`
          : hovered.label,
        sub: `${TYPE_NAME[hovered.tip]} · ${hovered.price}`,
      }
    : { title: "Izaberi mesto", sub: "Pređi mišem ili dodirni — pa klikni za rezervaciju" };

  return (
    <section
      ref={scope}
      id="tlocrt"
      className="relative mx-auto max-w-7xl scroll-mt-24 px-5 py-24 sm:py-32"
    >
      <div className="mb-10 text-center">
        <p className="map-reveal mb-3 text-xs font-medium uppercase tracking-[0.4em] text-neon-violet text-glow-soft">
          Tlocrt kluba
        </p>
        <h2 className="map-reveal font-display text-4xl font-extrabold text-white sm:text-5xl">
          Izaberi svoje mesto
        </h2>
        <p className="map-reveal mx-auto mt-4 max-w-xl text-white/60">
          Klikni na separe, barski sto ili šank na skici splava i odmah rezerviši
          baš to mesto.
        </p>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[1fr_280px]">
        {/* Skica */}
        <div className="map-reveal panel rounded-3xl p-4 sm:p-6">
          <svg
            className="club-svg h-auto w-full"
            viewBox="0 0 820 520"
            role="group"
            aria-label="Interaktivni tlocrt kluba Freestyler"
          >
            {/* Trup splava */}
            <rect
              x="40"
              y="46"
              width="740"
              height="428"
              rx="64"
              fill="rgba(255,255,255,0.02)"
              stroke="rgba(34,225,255,0.25)"
              strokeWidth="2"
            />
            <rect
              x="56"
              y="62"
              width="708"
              height="396"
              rx="54"
              fill="none"
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="1.5"
              strokeDasharray="2 9"
            />
            {/* Ulaz */}
            <text
              x="70"
              y="266"
              fontSize="11"
              letterSpacing="2"
              fill="rgba(255,255,255,0.45)"
            >
              ULAZ ▸
            </text>
            <text
              x="690"
              y="266"
              fontSize="10"
              letterSpacing="2"
              fill="rgba(255,255,255,0.3)"
            >
              ◂ SAVA
            </text>

            {/* Klikabilna mesta */}
            {ALL_SPOTS.map((s) => {
              const color = COLORS[s.tip];
              const active = hovered?.id === s.id;
              const fill = active ? `${color}59` : `${color}1f`;
              const props = {
                className: "club-spot",
                style: {
                  cursor: "pointer",
                  outline: "none",
                  filter: active ? `drop-shadow(0 0 8px ${color})` : "none",
                  transition: "filter 0.2s ease",
                } as React.CSSProperties,
                role: "button",
                tabIndex: 0,
                "aria-label": `${s.label}${s.level ? ` ${s.level}` : ""} — ${TYPE_NAME[s.tip]}, ${s.price}. Klikni za rezervaciju.`,
                onClick: () => pick(s),
                onKeyDown: (e: React.KeyboardEvent) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    pick(s);
                  }
                },
                onMouseEnter: () => setHovered(s),
                onMouseLeave: () => setHovered((h) => (h?.id === s.id ? null : h)),
                onFocus: () => setHovered(s),
                onBlur: () => setHovered((h) => (h?.id === s.id ? null : h)),
              };

              if (s.kind === "circle") {
                return (
                  <g key={s.id} {...props}>
                    <circle
                      cx={s.x}
                      cy={s.y}
                      r={s.r}
                      fill={fill}
                      stroke={color}
                      strokeWidth={active ? 2.4 : 1.6}
                    />
                    <text
                      x={s.x}
                      y={s.y + 4}
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="700"
                      fill="#fff"
                      pointerEvents="none"
                    >
                      {s.short}
                    </text>
                  </g>
                );
              }

              const isSank = s.id === "sank";
              return (
                <g key={s.id} {...props}>
                  <rect
                    x={s.x}
                    y={s.y}
                    width={s.w}
                    height={s.h}
                    rx={isSank ? 16 : 10}
                    fill={fill}
                    stroke={color}
                    strokeWidth={active ? 2.6 : 1.6}
                  />
                  <text
                    x={s.x + (s.w ?? 0) / 2}
                    y={s.y + (s.h ?? 0) / 2 + (isSank ? 5 : (s.level ? 0 : 4))}
                    textAnchor="middle"
                    fontSize={isSank ? 16 : 10}
                    fontWeight="700"
                    letterSpacing={isSank ? 3 : 0.5}
                    fill="#fff"
                    pointerEvents="none"
                  >
                    {s.short}
                  </text>
                  {s.level && (
                    <text
                      x={s.x + (s.w ?? 0) / 2}
                      y={s.y + (s.h ?? 0) / 2 + 14}
                      textAnchor="middle"
                      fontSize="8.5"
                      fontWeight="600"
                      letterSpacing="0.5"
                      fill={color}
                      pointerEvents="none"
                    >
                      {s.level.toUpperCase()}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Dinamička napomena */}
          <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-ink/40 px-4 py-3">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{
                background: hovered ? COLORS[hovered.tip] : "#ffffff66",
                boxShadow: hovered ? `0 0 10px ${COLORS[hovered.tip]}` : "none",
              }}
            />
            <div className="min-w-0">
              <p className="truncate font-semibold text-white">{caption.title}</p>
              <p className="truncate text-sm text-white/55">{caption.sub}</p>
            </div>
          </div>
        </div>

        {/* Legenda */}
        <div className="map-reveal panel rounded-3xl p-6">
          <p className="text-xs font-medium uppercase tracking-widest text-white/40">
            Legenda
          </p>
          <ul className="mt-4 space-y-4">
            {(
              [
                { tip: "separe", name: "Separei (VIP)", desc: "Spoljni prsten — Sofa / VIP / Ultra VIP" },
                { tip: "barski_sto", name: "Barski stolovi", desc: "Srednji prsten — visoko sedenje" },
                { tip: "sank", name: "Šank", desc: "Centar — ulaz po osobi" },
              ] as const
            ).map((l) => (
              <li key={l.tip} className="flex gap-3">
                <span
                  className="mt-1 h-4 w-4 shrink-0 rounded-md border"
                  style={{
                    borderColor: COLORS[l.tip],
                    background: `${COLORS[l.tip]}26`,
                    boxShadow: `0 0 8px ${COLORS[l.tip]}55`,
                  }}
                />
                <div>
                  <p className="font-semibold text-white">{l.name}</p>
                  <p className="text-sm text-white/55">{l.desc}</p>
                </div>
              </li>
            ))}
          </ul>
          <a
            href="#rezervacije"
            className="btn-outline-neon mt-7 inline-flex w-full justify-center rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em]"
          >
            Svi paketi i cene
          </a>
        </div>
      </div>
    </section>
  );
}
