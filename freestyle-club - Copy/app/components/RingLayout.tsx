"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const RINGS = [
  {
    id: "separe",
    color: "var(--color-neon-violet)",
    title: "Spoljni prsten — Separei",
    text: "Privatni separei za vaše društvo. Maksimalna privatnost, premium flaše i posluga.",
  },
  {
    id: "barski",
    color: "var(--color-neon-magenta)",
    title: "Srednji prsten — Barski stolovi",
    text: "Visoko sedenje i barski stolovi — vaše mesto za celo veče, blizu svega.",
  },
  {
    id: "sank",
    color: "var(--color-neon-cyan)",
    title: "Centar — Veliki šank",
    text: "Srce splava. Veliki centralni šank gde se sve dešava.",
  },
];

export default function RingLayout() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Tekst reveal
        gsap.from(".about-reveal", {
          y: 40,
          autoAlpha: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: scope.current, start: "top 70%" },
        });

        // Prstenovi se otkrivaju spolja ka unutra
        gsap.from(".ring-shape", {
          scale: 0.4,
          autoAlpha: 0,
          transformOrigin: "center",
          duration: 0.9,
          stagger: 0.18,
          ease: "back.out(1.6)",
          scrollTrigger: { trigger: ".ring-svg", start: "top 75%" },
        });

        gsap.from(".ring-legend", {
          x: 24,
          autoAlpha: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: { trigger: ".ring-svg", start: "top 70%" },
        });

        // Suptilna rotacija spoljnog prstena
        gsap.to(".ring-outer", {
          rotation: 360,
          transformOrigin: "center",
          repeat: -1,
          duration: 60,
          ease: "none",
        });
      });

      return () => mm.revert();
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      id="o-klubu"
      className="relative mx-auto max-w-7xl scroll-mt-24 px-5 py-24 sm:py-32"
    >
      <div className="grid items-center gap-14 lg:grid-cols-2">
        {/* Tekst */}
        <div>
          <p className="about-reveal mb-4 text-xs font-medium uppercase tracking-[0.4em] text-neon-magenta text-glow-soft">
            O klubu / Atmosfera
          </p>
          <h2 className="about-reveal font-display text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            Jedan od najboljih
            <br />
            provoda u Beogradu
          </h2>
          <p className="about-reveal mt-6 max-w-lg text-base leading-relaxed text-white/70">
            Preko <span className="text-white">10 godina tradicije</span> na
            samoj reci. House, RnB, Hip-Hop i Disco — od prvog do poslednjeg
            takta. Vrhunski zvuk, energija i ekipa koja zna šta je dobar provod.
          </p>
          <p className="about-reveal mt-4 max-w-lg text-base leading-relaxed text-white/70">
            Splav je organizovan u <span className="text-white">tri prstena</span>{" "}
            — od centralnog šanka, preko barskih stolova, do privatnih separea uz
            samu ivicu vode.
          </p>

          {/* Legenda prstenova */}
          <div className="mt-8 space-y-4">
            {RINGS.map((r) => (
              <div key={r.id} className="ring-legend flex gap-3">
                <span
                  className="mt-1.5 h-3 w-3 shrink-0 rounded-full"
                  style={{
                    background: r.color,
                    boxShadow: `0 0 10px ${r.color}`,
                  }}
                />
                <div>
                  <p className="font-semibold text-white">{r.title}</p>
                  <p className="text-sm text-white/60">{r.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Animirana SVG šema prstenova */}
        <div className="flex min-w-0 justify-center">
          <svg
            className="ring-svg h-auto w-full max-w-md"
            viewBox="0 0 400 400"
            role="img"
            aria-label="Raspored splava po prstenovima: spoljni separei, srednji barski stolovi, centralni šank"
          >
            <defs>
              <radialGradient id="ringCore" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#22e1ff" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#22e1ff" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Spoljni prsten — separei */}
            <g className="ring-shape ring-outer">
              <circle
                cx="200"
                cy="200"
                r="170"
                fill="none"
                stroke="var(--color-neon-violet)"
                strokeWidth="2"
                strokeDasharray="3 10"
                opacity="0.9"
              />
              {Array.from({ length: 12 }).map((_, i) => {
                const a = (i / 12) * Math.PI * 2;
                return (
                  <rect
                    key={i}
                    x={200 + Math.cos(a) * 170 - 7}
                    y={200 + Math.sin(a) * 170 - 7}
                    width="14"
                    height="14"
                    rx="3"
                    fill="none"
                    stroke="var(--color-neon-violet)"
                    strokeWidth="1.6"
                  />
                );
              })}
            </g>

            {/* Srednji prsten — barski stolovi */}
            <g className="ring-shape">
              <circle
                cx="200"
                cy="200"
                r="110"
                fill="none"
                stroke="var(--color-neon-magenta)"
                strokeWidth="2"
                strokeDasharray="2 8"
                opacity="0.9"
              />
              {Array.from({ length: 8 }).map((_, i) => {
                const a = (i / 8) * Math.PI * 2 + 0.3;
                return (
                  <circle
                    key={i}
                    cx={200 + Math.cos(a) * 110}
                    cy={200 + Math.sin(a) * 110}
                    r="7"
                    fill="none"
                    stroke="var(--color-neon-magenta)"
                    strokeWidth="1.6"
                  />
                );
              })}
            </g>

            {/* Centar — veliki šank */}
            <g className="ring-shape">
              <circle cx="200" cy="200" r="80" fill="url(#ringCore)" />
              <circle
                cx="200"
                cy="200"
                r="52"
                fill="none"
                stroke="var(--color-neon-cyan)"
                strokeWidth="2.4"
              />
              <circle
                cx="200"
                cy="200"
                r="6"
                fill="var(--color-neon-cyan)"
              />
              <text
                x="200"
                y="204"
                textAnchor="middle"
                fontSize="13"
                fontWeight="700"
                letterSpacing="2"
                fill="#eafdff"
              >
                ŠANK
              </text>
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
