import { siteConfig } from "@/lib/site-config";

const SOCIALS: { label: string; href: string }[] = [
  { label: "Instagram", href: siteConfig.socials.instagram },
  { label: "Facebook", href: siteConfig.socials.facebook },
  { label: "TikTok", href: siteConfig.socials.tiktok },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-ink/60">
      <div className="mx-auto max-w-7xl px-5 py-16">
        {/* Završni CTA */}
        <div className="mb-14 text-center">
          <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
            Vidimo se na reci.
          </h2>
          <a
            href="#rezervacije"
            className="btn-neon mt-6 inline-flex rounded-full px-10 py-4 text-sm font-bold uppercase tracking-[0.2em]"
          >
            Rezerviši
          </a>
        </div>

        <div className="grid gap-10 border-t border-white/10 pt-12 sm:grid-cols-3">
          {/* Logo / opis */}
          <div>
            <p className="font-display text-2xl font-extrabold text-white">
              FREE<span className="text-neon-magenta text-glow">STYLER</span>
            </p>
            <p className="mt-3 max-w-xs text-sm text-white/55">
              {siteConfig.tagline} Rečni splav na Savi, Beograd.
            </p>
          </div>

          {/* Telefoni */}
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-white/40">
              Rezervacije
            </p>
            <ul className="mt-3 space-y-2">
              {siteConfig.phones.map((p) => (
                <li key={p.number}>
                  <a
                    href={p.href}
                    className="text-white/80 transition-colors hover:text-neon-cyan"
                  >
                    <span className="text-white/40">{p.label}: </span>
                    {p.number}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Mreže */}
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-white/40">
              Pratite nas
            </p>
            <ul className="mt-3 space-y-2">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 transition-colors hover:text-neon-magenta"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-12 text-center text-xs text-white/35">
          © {new Date().getFullYear()} FREESTYLER · Sva prava zadržana ·
          Rezervacija je besplatna, ali obavezna.
        </p>
      </div>
    </footer>
  );
}
