"use client";

import { useEffect, useState } from "react";

const LINKS = [
  { href: "#o-klubu", label: "O klubu" },
  { href: "#dogadjaji", label: "Događaji" },
  { href: "#galerija", label: "Galerija" },
  { href: "#tlocrt", label: "Tlocrt" },
  { href: "#lokacija", label: "Lokacija" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-ink/90 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5">
        <a
          href="#vrh"
          className="font-display text-lg font-extrabold tracking-tight text-white"
        >
          FREE<span className="text-neon-magenta text-glow">STYLER</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-white/70 transition-colors hover:text-neon-cyan"
            >
              {l.label}
            </a>
          ))}
        </div>

        <a
          href="#rezervacije"
          className="btn-neon rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-[0.18em]"
        >
          Rezerviši
        </a>
      </nav>
    </header>
  );
}
