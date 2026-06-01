"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const IMAGES = [
  "/gallery-1.jpg",
  "/gallery-2.jpg",
  "/gallery-3.jpg",
  "/gallery-4.jpg",
  "/gallery-5.jpg",
  "/gallery-6.jpg",
  "/gallery-7.jpg",
  "/gallery-8.jpg",
];

const ROW_TOP = IMAGES;
const ROW_BOTTOM = [...IMAGES].reverse();

function Tile({ src }: { src: string }) {
  return (
    <div className="group/tile relative h-40 w-62.5 shrink-0 overflow-hidden rounded-2xl border border-white/10 sm:h-52.5 sm:w-80">
      <Image
        src={src}
        alt="Atmosfera kluba Freestyler"
        fill
        sizes="320px"
        className="object-cover transition-transform duration-500 group-hover/tile:scale-110"
      />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/50 to-transparent" />
    </div>
  );
}

function Row({
  images,
  direction,
  duration,
}: {
  images: string[];
  direction: "animate-marquee" | "animate-marquee-rev";
  duration: number;
}) {
  return (
    <div className="gallery-row group relative overflow-hidden mask-[linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
      <div
        className={`gallery-track flex w-max ${direction}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex shrink-0 gap-4 pr-4"
            aria-hidden={copy === 1 ? true : undefined}
          >
            {images.map((src, i) => (
              <Tile key={i} src={src} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Gallery() {
  const scope = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);

  // Pauziraj trake kada galerija nije u vidokrugu
  useEffect(() => {
    const el = scope.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setPaused(!entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".gallery-row", {
          autoAlpha: 0,
          y: 40,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: scope.current, start: "top 80%" },
        });
      });
      return () => mm.revert();
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      id="galerija"
      className={`relative scroll-mt-24 py-24 sm:py-32 ${paused ? "gallery-paused" : ""}`}
    >
      <div className="mb-12 px-5 text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.4em] text-neon-magenta text-glow-soft">
          Galerija
        </p>
        <h2 className="font-display text-4xl font-extrabold text-white sm:text-5xl">
          Atmosfera
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        <Row images={ROW_TOP} direction="animate-marquee" duration={45} />
        <Row images={ROW_BOTTOM} direction="animate-marquee-rev" duration={55} />
      </div>
    </section>
  );
}
