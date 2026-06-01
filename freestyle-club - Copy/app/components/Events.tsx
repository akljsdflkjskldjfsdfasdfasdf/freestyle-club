"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { AppEvent } from "@/lib/pocketbase";
import { formatDateParts, formatDateSr } from "@/lib/format";
import { siteConfig } from "@/lib/site-config";

gsap.registerPlugin(ScrollTrigger);

export default function Events({ events }: { events: AppEvent[] }) {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".events-head", {
          y: 30,
          autoAlpha: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: scope.current, start: "top 75%" },
        });

        // Kartice se animiraju samo ako postoje događaji
        if (events.length > 0) {
          gsap.from(".event-card", {
            y: 60,
            autoAlpha: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: { trigger: ".events-grid", start: "top 80%" },
          });
        } else {
          gsap.from(".events-empty", {
            y: 40,
            autoAlpha: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: ".events-empty", start: "top 85%" },
          });
        }
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      id="dogadjaji"
      className="relative mx-auto max-w-7xl scroll-mt-24 px-5 py-24 sm:py-32"
    >
      <div className="events-head mb-12 text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.4em] text-neon-cyan text-glow-soft">
          Lineup
        </p>
        <h2 className="font-display text-4xl font-extrabold text-white sm:text-5xl">
          Predstojeće žurke
        </h2>
      </div>

      {events.length === 0 ? (
        <div className="events-empty panel mx-auto max-w-xl rounded-3xl px-8 py-14 text-center">
          <p className="font-display text-2xl font-bold text-white">
            Uskoro objavljujemo nove datume
          </p>
          <p className="mt-3 text-white/60">
            Pratite nas na Instagramu za najnoviji lineup — ili odmah rezervišite
            svoje mesto.
          </p>
          <a
            href={siteConfig.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-neon mt-6 inline-flex rounded-full px-7 py-3 text-sm font-semibold uppercase tracking-[0.18em]"
          >
            Instagram
          </a>
        </div>
      ) : (
        <div className="events-grid grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((ev) => {
            const d = formatDateParts(ev.datum);
            return (
              <article
                key={ev.id}
                className="event-card group panel overflow-hidden rounded-3xl transition-transform duration-300 hover:-translate-y-1.5"
              >
                {/* Flyer (gradijent + ime su fallback; slika ide preko njih).
                    Ako slika fali (onError) → ostaje lep gradijent sa imenom. */}
                <div className="relative aspect-[4/5] overflow-hidden bg-linear-to-br from-neon-purple/40 via-ink-3 to-neon-magenta/30">
                  <span className="absolute inset-0 flex items-center justify-center px-3 text-center font-display text-2xl font-bold text-white/80">
                    {ev.naziv || "FREESTYLER"}
                  </span>
                  {ev.flyerUrl && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={ev.flyerUrl}
                      alt={`Flyer — ${ev.naziv}`}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/10 to-transparent" />

                  {/* Datum badge */}
                  <div className="absolute left-4 top-4 rounded-2xl border border-white/15 bg-ink/70 px-3 py-2 text-center backdrop-blur-md">
                    <p className="font-display text-2xl font-extrabold leading-none text-neon-cyan">
                      {d.dan}
                    </p>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-white/70">
                      {d.mesec}
                    </p>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5">
                  <p className="text-xs font-medium uppercase tracking-widest text-white/40">
                    {d.dow} · {formatDateSr(ev.datum)}
                  </p>
                  <h3 className="mt-1.5 font-display text-xl font-bold text-white">
                    {ev.naziv}
                  </h3>
                  {ev.lineup && (
                    <p className="mt-2 text-sm font-medium text-neon-magenta">
                      {ev.lineup}
                    </p>
                  )}
                  {ev.opis && (
                    <p className="mt-2 line-clamp-3 text-sm text-white/60">
                      {ev.opis}
                    </p>
                  )}
                  <a
                    href="#rezervacije"
                    className="mt-4 inline-flex text-sm font-semibold uppercase tracking-[0.15em] text-neon-cyan transition-colors hover:text-white"
                  >
                    Rezerviši →
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <p className="mt-14 text-center text-sm text-white/60">
        Sve žurke, najave i fotke su na{" "}
        <a
          href={siteConfig.socials.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-neon-magenta transition-colors hover:text-white"
        >
          Instagramu — pogledaj za više →
        </a>
      </p>
    </section>
  );
}
