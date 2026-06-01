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
  return (
    <section
      className="relative overflow-hidden border-y border-white/10 bg-ink/40 py-5"
      aria-label="House, RnB, Hip-Hop, Disco — Freestyler"
    >
      <div className="animate-marquee flex w-max">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex shrink-0 items-center gap-8 pr-8"
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
      </div>
    </section>
  );
}
