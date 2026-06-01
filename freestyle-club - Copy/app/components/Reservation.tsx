"use client";

import ReservationCards from "./ReservationCards";
import { useReservation } from "./ReservationProvider";

export default function Reservation() {
  const { open } = useReservation();

  return (
    <section
      id="rezervacije"
      className="relative mx-auto max-w-7xl scroll-mt-24 px-5 py-24 sm:py-32"
    >
      <div className="mb-4 text-center">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.4em] text-neon-cyan text-glow-soft">
          Rezervacije
        </p>
        <h2 className="font-display text-4xl font-extrabold text-white sm:text-5xl">
          Obezbedi svoje mesto
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/60">
          Rezervacija je{" "}
          <span className="text-white">besplatna, ali obavezna</span>. Izaberi
          tip mesta ili klikni na tlocrt iznad — kontaktiraćemo te radi potvrde.
        </p>
      </div>

      <div className="mt-12">
        <ReservationCards onSelect={(id) => open(id)} />
      </div>
    </section>
  );
}
