"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { AppEvent } from "@/lib/pocketbase";
import { createReservation } from "@/lib/pocketbase";
import {
  reservationTypes,
  getReservationType,
  type ReservationTypeId,
} from "@/lib/reservations-config";
import { formatDateSr, toDateInputValue } from "@/lib/format";

type Status = "idle" | "loading" | "success" | "error";

interface OpenOptions {
  /** Predizabran paket (id iz reservations-config). */
  paket?: string;
  /** Konkretno mesto sa tlocrta, npr "Separe 5 (Ultra VIP)". */
  spot?: string;
}

interface ReservationContextValue {
  open: (tip: ReservationTypeId, opts?: OpenOptions) => void;
}

const ReservationContext = createContext<ReservationContextValue | null>(null);

export function useReservation(): ReservationContextValue {
  const ctx = useContext(ReservationContext);
  if (!ctx)
    throw new Error("useReservation mora biti unutar <ReservationProvider>");
  return ctx;
}

interface FormState {
  ime: string;
  telefon: string;
  email: string;
  paket: string;
  event: string;
  datum: string;
  broj_osoba: number;
  poruka: string;
}

const emptyForm = (paket: string): FormState => ({
  ime: "",
  telefon: "",
  email: "",
  paket,
  event: "",
  datum: "",
  broj_osoba: 2,
  poruka: "",
});

export default function ReservationProvider({
  events,
  children,
}: {
  events: AppEvent[];
  children: React.ReactNode;
}) {
  const [tip, setTip] = useState<ReservationTypeId | null>(null);
  const [spot, setSpot] = useState("");
  const [form, setForm] = useState<FormState>(emptyForm("sank-ulaz"));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const isOpen = tip !== null;
  const activeType = tip ? getReservationType(tip) : null;

  const open = (id: ReservationTypeId, opts?: OpenOptions) => {
    const type = getReservationType(id);
    setTip(id);
    setSpot(opts?.spot ?? "");
    setForm(emptyForm(opts?.paket ?? type.packages[0].id));
    setErrors({});
    setServerError("");
    setStatus("idle");
  };

  const close = () => setTip(null);

  const changeTip = (id: ReservationTypeId) => {
    const type = getReservationType(id);
    setTip(id);
    setSpot(""); // mesto sa tlocrta važi samo za prvobitni tip
    setForm((f) => ({ ...f, paket: type.packages[0].id }));
  };

  const updateField = <K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      if (!e[key as string]) return e;
      const next = { ...e };
      delete next[key as string];
      return next;
    });
  };

  const handleEvent = (id: string) => {
    const ev = events.find((e) => e.id === id);
    setForm((f) => ({
      ...f,
      event: id,
      datum: ev ? toDateInputValue(ev.datum) : f.datum,
    }));
    setErrors((e) => ({ ...e, datum: "" }));
  };

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => firstFieldRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [isOpen]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (form.ime.trim().length < 2) e.ime = "Unesite ime i prezime.";
    if (form.telefon.replace(/[\s\-()]/g, "").length < 6)
      e.telefon = "Unesite ispravan broj telefona.";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Email adresa nije ispravna.";
    if (!form.datum) e.datum = "Izaberite datum.";
    if (!form.broj_osoba || form.broj_osoba < 1)
      e.broj_osoba = "Najmanje 1 osoba.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tip || !validate()) return;
    setStatus("loading");
    setServerError("");
    // Izabrano mesto sa tlocrta dodajemo u poruku (PB nema posebno polje)
    const poruka = [spot ? `Izabrano mesto: ${spot}.` : "", form.poruka.trim()]
      .filter(Boolean)
      .join(" ");
    try {
      await createReservation({
        ime: form.ime.trim(),
        telefon: form.telefon.trim(),
        email: form.email.trim() || undefined,
        tip,
        paket: form.paket,
        broj_osoba: Number(form.broj_osoba),
        event: form.event || undefined,
        datum: form.datum,
        poruka: poruka || undefined,
      });
      setStatus("success");
    } catch {
      setStatus("error");
      setServerError(
        "Došlo je do greške pri slanju. Pokušajte ponovo ili nas pozovite telefonom.",
      );
    }
  };

  return (
    <ReservationContext.Provider value={{ open }}>
      {children}

      {isOpen && activeType && (
        <div
          className="animate-fade-in fixed inset-0 z-[70] overflow-y-auto bg-ink/80 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-labelledby="rez-naslov"
        >
          {/* Zaseban scroll-kontejner + centriranje preko min-h-full: kad je
              forma viša od ekrana, vrh (X + prva polja) ostaje dostupan skrolom. */}
          <div className="flex min-h-full items-end justify-center p-0 sm:items-center sm:p-6">
          <div
            className="animate-pop-in panel relative w-full max-w-lg rounded-t-3xl border-white/10 p-5 sm:rounded-3xl sm:p-7"
            onClick={(ev) => ev.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Zatvori"
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              ✕
            </button>

            {status === "success" ? (
              <div className="py-6 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-neon-cyan/50 text-3xl text-neon-cyan text-glow">
                  ✓
                </div>
                <h3 className="font-display text-2xl font-bold text-white">
                  Hvala! Rezervacija je primljena.
                </h3>
                <p className="mt-3 text-white/70">
                  Kontaktiraćemo vas u najkraćem roku radi potvrde. Rezervacija je
                  besplatna, ali obavezna.
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="btn-neon mt-7 rounded-full px-8 py-3 text-sm font-bold uppercase tracking-[0.18em]"
                >
                  Zatvori
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <p
                  id="rez-naslov"
                  className="font-display text-xl font-extrabold text-white"
                >
                  Rezervacija — {activeType.name}
                </p>
                <p className="mt-1 text-sm text-white/50">{activeType.short}</p>

                {/* Izabrano mesto sa tlocrta */}
                {spot && (
                  <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-neon-violet/40 bg-neon-violet/10 px-3 py-1.5 text-sm text-white">
                    <span className="h-2 w-2 rounded-full bg-neon-violet" />
                    Izabrano mesto: <span className="font-semibold">{spot}</span>
                  </p>
                )}

                {/* Tip (segmentirano) */}
                <div className="mt-4">
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-white/50">
                    Tip mesta
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {reservationTypes.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => changeTip(t.id)}
                        className={`rounded-xl border px-2 py-2.5 text-xs font-semibold transition-colors ${
                          tip === t.id
                            ? "border-neon-magenta bg-neon-magenta/15 text-white"
                            : "border-white/12 text-white/60 hover:border-white/30"
                        }`}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Paket */}
                <Field label="Paket" className="mt-4">
                  <select
                    value={form.paket}
                    onChange={(e) => updateField("paket", e.target.value)}
                    className="input"
                  >
                    {activeType.packages.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {p.price}
                      </option>
                    ))}
                  </select>
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Ime i prezime *" error={errors.ime} className="mt-4">
                    <input
                      ref={firstFieldRef}
                      type="text"
                      value={form.ime}
                      onChange={(e) => updateField("ime", e.target.value)}
                      placeholder="Petar Petrović"
                      className="input"
                    />
                  </Field>

                  <Field label="Telefon *" error={errors.telefon} className="mt-4">
                    <input
                      type="tel"
                      value={form.telefon}
                      onChange={(e) => updateField("telefon", e.target.value)}
                      placeholder="+381 6x xxx xxxx"
                      className="input"
                    />
                  </Field>
                </div>

                <Field label="Email" error={errors.email} className="mt-4">
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="email@primer.com"
                    className="input"
                  />
                </Field>

                {events.length > 0 && (
                  <Field label="Događaj" className="mt-4">
                    <select
                      value={form.event}
                      onChange={(e) => handleEvent(e.target.value)}
                      className="input"
                    >
                      <option value="">Bez određenog događaja</option>
                      {events.map((ev) => (
                        <option key={ev.id} value={ev.id}>
                          {ev.naziv} — {formatDateSr(ev.datum)}
                        </option>
                      ))}
                    </select>
                  </Field>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Datum *" error={errors.datum} className="mt-4">
                    <input
                      type="date"
                      value={form.datum}
                      onChange={(e) => updateField("datum", e.target.value)}
                      className="input [color-scheme:dark]"
                    />
                  </Field>

                  <Field
                    label="Broj osoba *"
                    error={errors.broj_osoba}
                    className="mt-4"
                  >
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={form.broj_osoba}
                      onChange={(e) =>
                        updateField("broj_osoba", Number(e.target.value))
                      }
                      className="input"
                    />
                  </Field>
                </div>

                <Field label="Poruka (opciono)" className="mt-4">
                  <textarea
                    value={form.poruka}
                    onChange={(e) => updateField("poruka", e.target.value)}
                    rows={2}
                    placeholder="Posebne želje, povod za slavlje…"
                    className="input resize-none"
                  />
                </Field>

                {serverError && (
                  <p className="mt-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {serverError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn-neon mt-6 flex w-full items-center justify-center gap-2 rounded-full py-4 text-sm font-bold uppercase tracking-[0.18em] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "loading" ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Slanje…
                    </>
                  ) : (
                    "Pošalji rezervaciju"
                  )}
                </button>

                <p className="mt-3 text-center text-xs text-white/40">
                  Rezervacija je besplatna, ali obavezna.
                </p>
              </form>
            )}
          </div>
          </div>
        </div>
      )}
    </ReservationContext.Provider>
  );
}

function Field({
  label,
  error,
  className = "",
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-white/50">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
