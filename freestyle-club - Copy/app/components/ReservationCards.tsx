"use client";

import {
  reservationTypes,
  type ReservationTypeId,
  type AccentColor,
} from "@/lib/reservations-config";

const ACCENT: Record<
  AccentColor,
  { glow: string; text: string; dot: string }
> = {
  cyan: { glow: "glow-cyan", text: "text-neon-cyan", dot: "#22e1ff" },
  magenta: { glow: "glow-magenta", text: "text-neon-magenta", dot: "#ff2e9a" },
  violet: { glow: "glow-violet", text: "text-neon-violet", dot: "#a855f7" },
};

export default function ReservationCards({
  onSelect,
}: {
  onSelect: (id: ReservationTypeId) => void;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {reservationTypes.map((t) => {
        const a = ACCENT[t.accent];
        // ključne stavke iz prvog paketa za pregled na kartici
        const highlights = t.packages[0].includes.slice(0, 4);

        return (
          <div
            key={t.id}
            className={`reservation-card panel flex flex-col rounded-3xl p-7 transition-transform duration-300 hover:-translate-y-2 ${a.glow}`}
          >
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/40">
              {t.ring}
            </p>
            <h3 className={`mt-2 font-display text-2xl font-extrabold ${a.text} text-glow-soft`}>
              {t.name}
            </h3>
            <p className="mt-1 text-sm text-white/60">{t.short}</p>

            <p className="mt-5 font-display text-xl font-bold text-white">
              {t.priceFrom}
            </p>
            <p className="text-xs uppercase tracking-widest text-white/40">
              cena je placeholder
            </p>

            <ul className="mt-5 flex-1 space-y-2.5">
              {highlights.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-white/75">
                  <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: a.dot, boxShadow: `0 0 8px ${a.dot}` }}
                  />
                  {item}
                </li>
              ))}
            </ul>

            {t.packages.length > 1 && (
              <p className="mt-4 text-xs text-white/40">
                {t.packages.length} nivoa — izbor u formi
              </p>
            )}

            <button
              type="button"
              onClick={() => onSelect(t.id)}
              className="btn-neon mt-6 w-full rounded-full py-3.5 text-sm font-bold uppercase tracking-[0.18em]"
            >
              Rezerviši
            </button>
          </div>
        );
      })}
    </div>
  );
}
