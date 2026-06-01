"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { siteConfig } from "@/lib/site-config";
import FallingItems from "./FallingItems";

const TITLE = "FREESTYLER";

export default function Hero() {
  const scope = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(true);

  // Pauziraj video + blobove kada hero nije u vidokrugu (štedi resurse → manje laga)
  useEffect(() => {
    const el = scope.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (inView && !reduce) v.play().catch(() => {});
    else v.pause();
  }, [inView]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set([".hero-kicker", ".hero-slogan", ".hero-cta"], {
          autoAlpha: 0,
        });
        gsap.set(".hero-letter", { autoAlpha: 0, yPercent: 130, rotateX: -80 });

        const tl = gsap.timeline({ delay: 0.7 });
        tl.fromTo(
          ".hero-kicker",
          { y: 16 },
          { y: 0, autoAlpha: 1, duration: 0.6, ease: "power2.out" },
        )
          .to(
            ".hero-letter",
            {
              autoAlpha: 1,
              yPercent: 0,
              rotateX: 0,
              duration: 0.9,
              ease: "back.out(1.7)",
              stagger: 0.06,
            },
            "-=0.1",
          )
          .fromTo(
            ".hero-slogan",
            { y: 20 },
            { y: 0, autoAlpha: 1, duration: 0.7, ease: "power2.out" },
            "-=0.4",
          )
          .fromTo(
            ".hero-cta",
            { y: 24, scale: 0.9 },
            {
              y: 0,
              scale: 1,
              autoAlpha: 1,
              duration: 0.7,
              ease: "back.out(1.7)",
              stagger: 0.1,
            },
            "-=0.4",
          );

        // NB: ne animiramo više `text-shadow` u petlji — to je „paint” svojstvo
        // (ne ide na GPU), pa je preslikavalo ogroman naslov svaki frame → lag.
        // Suptilan „dah” radimo preko opacity-ja (kompozitovano, jeftino).
        gsap.to(".hero-title", {
          opacity: 0.88,
          repeat: -1,
          yoyo: true,
          duration: 2.6,
          ease: "sine.inOut",
          delay: 2,
        });
      });

      return () => mm.revert();
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      id="vrh"
      className={`relative flex min-h-svh w-full flex-col items-center justify-center overflow-hidden px-5 pt-20 pb-16 ${
        inView ? "" : "hero-paused"
      }`}
    >
      {/* Pozadina: poster (uvek) + video (desktop) + blobovi */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50"
          style={{ backgroundImage: "url('/hero-bg.jpg')" }}
        />
        {/* Video samo na md+ (štedi mobilni saobraćaj i bateriju) */}
        <video
          ref={videoRef}
          className="absolute inset-0 hidden h-full w-full object-cover opacity-55 md:block"
          muted
          loop
          playsInline
          preload="metadata"
          poster="/hero-bg.jpg"
        >
          <source src="/hero-loop.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-linear-to-b from-ink/50 via-ink/65 to-ink" />

        <span
          className="neon-blob left-[8%] top-[18%] h-64 w-64"
          style={{ background: "var(--color-neon-purple)" }}
        />
        <span
          className="neon-blob right-[10%] top-[12%] h-72 w-72"
          style={{
            background: "var(--color-neon-cyan)",
            animationDelay: "-6s",
          }}
        />
        <span
          className="neon-blob bottom-[6%] left-1/2 h-72 w-72"
          style={{
            background: "var(--color-neon-magenta)",
            animationDelay: "-11s",
          }}
        />
      </div>

      <FallingItems />

      {/* Sadržaj */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <p className="hero-kicker mb-4 text-xs font-medium uppercase tracking-[0.45em] text-neon-cyan/90 text-glow-soft sm:text-sm">
          Rečni splav · Sava · Beograd
        </p>

        <h1
          className="hero-word hero-title font-display text-[clamp(2rem,11vw,11rem)] font-extrabold leading-[0.9] tracking-tight whitespace-nowrap text-white"
          style={{
            textShadow: "0 0 0.4em #ff2e9a, 0 0 1.3em rgba(168,85,247,0.6)",
          }}
          aria-label={TITLE}
        >
          {TITLE.split("").map((ch, i) => (
            <span key={i} className="hero-letter" aria-hidden="true">
              {ch}
            </span>
          ))}
        </h1>

        <p className="hero-slogan mt-6 max-w-xl text-balance text-base text-white/75 sm:text-lg">
          {siteConfig.tagline} — House, RnB, Hip-Hop &amp; Disco. Preko 10
          godina najjačeg provoda na vodi.
        </p>

        <div className="hero-cta mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <a
            href="#rezervacije"
            className="btn-neon inline-flex items-center justify-center rounded-full px-10 py-4 text-sm font-bold uppercase tracking-[0.2em]"
          >
            Rezerviši
          </a>
          <a
            href="#tlocrt"
            className="btn-outline-neon inline-flex items-center justify-center rounded-full px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em]"
          >
            Izaberi mesto
          </a>
        </div>

        <p className="hero-cta mt-6 text-xs uppercase tracking-[0.25em] text-white/40">
          Rezervacija je besplatna, ali obavezna
        </p>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/25 p-1.5">
          <span className="h-2 w-1 animate-bounce rounded-full bg-neon-cyan" />
        </div>
      </div>
    </section>
  );
}
