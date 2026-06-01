"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { siteConfig, getMapsLink, getMapsEmbed } from "@/lib/site-config";

gsap.registerPlugin(ScrollTrigger);

export default function LocationMap() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".loc-reveal", {
          y: 40,
          autoAlpha: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: scope.current, start: "top 75%" },
        });
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      id="lokacija"
      className="relative mx-auto max-w-7xl scroll-mt-24 px-5 py-24 sm:py-32"
    >
      <div className="mb-12 text-center">
        <p className="loc-reveal mb-3 text-xs font-medium uppercase tracking-[0.4em] text-neon-violet text-glow-soft">
          Lokacija
        </p>
        <h2 className="loc-reveal font-display text-4xl font-extrabold text-white sm:text-5xl">
          Splav na Savi
        </h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Info */}
        <div className="loc-reveal panel flex flex-col justify-between rounded-3xl p-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-white/40">
              Adresa
            </p>
            <p className="mt-1.5 font-display text-xl font-bold text-white">
              {siteConfig.location.address}
            </p>
            <p className="text-white/60">{siteConfig.location.city}</p>

            <div className="mt-7">
              <p className="text-xs font-medium uppercase tracking-widest text-white/40">
                Radno vreme
              </p>
              <ul className="mt-2 space-y-1.5">
                {siteConfig.hours.map((h) => (
                  <li
                    key={h.days}
                    className="flex justify-between gap-6 text-white/80"
                  >
                    <span>{h.days}</span>
                    <span className="font-medium text-neon-cyan">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <a
            href={getMapsLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-neon mt-8 inline-flex items-center justify-center rounded-full px-8 py-4 text-sm font-bold uppercase tracking-[0.18em]"
          >
            Otvori na mapi
          </a>
        </div>

        {/* Embed mapa */}
        <div className="loc-reveal overflow-hidden rounded-3xl border border-white/10">
          <iframe
            title="Lokacija — Freestyler"
            src={getMapsEmbed()}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full min-h-[320px] w-full grayscale-[0.3] invert-[0.92] hue-rotate-180"
          />
        </div>
      </div>
    </section>
  );
}
