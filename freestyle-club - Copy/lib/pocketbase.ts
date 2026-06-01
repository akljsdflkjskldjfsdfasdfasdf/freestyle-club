import PocketBase, { type RecordModel } from "pocketbase";

/**
 * URL PocketBase servera. Čita se iz env varijable NEXT_PUBLIC_POCKETBASE_URL,
 * sa fallback-om na lokalni dev server.
 */
export const POCKETBASE_URL =
  process.env.NEXT_PUBLIC_POCKETBASE_URL ?? "http://127.0.0.1:8090";

/**
 * Nova instanca SDK-a. Na serveru pravimo svežu instancu po pozivu
 * (da ne delimo auth stanje između zahteva), na klijentu koristimo singleton.
 */
export function createPocketBase(): PocketBase {
  return new PocketBase(POCKETBASE_URL);
}

let browserPb: PocketBase | null = null;

export function getPocketBase(): PocketBase {
  if (typeof window === "undefined") return createPocketBase();
  if (!browserPb) browserPb = createPocketBase();
  return browserPb;
}

/* ------------------------------------------------------------------ */
/* Events                                                              */
/* ------------------------------------------------------------------ */

export interface EventRecord extends RecordModel {
  naziv: string;
  datum: string;
  lineup: string;
  opis: string;
  flyer: string;
  aktivan: boolean;
}

/** Serijalizovan oblik koji prosleđujemo klijentskim komponentama. */
export interface AppEvent {
  id: string;
  naziv: string;
  datum: string;
  lineup: string;
  opis: string;
  flyerUrl: string;
}

/**
 * Učitava aktivne događaje, sortirane po datumu. Bezbedno vraća prazan niz
 * ako PocketBase nije dostupan (npr. server nije pokrenut) — sajt i dalje radi.
 */
export async function getEvents(): Promise<AppEvent[]> {
  try {
    const pb = createPocketBase();
    const records = await pb
      .collection("events")
      .getFullList<EventRecord>({ filter: "aktivan = true", sort: "datum" });

    return records.map((r) => ({
      id: r.id,
      naziv: r.naziv,
      datum: r.datum,
      lineup: r.lineup,
      opis: r.opis,
      flyerUrl: r.flyer ? pb.files.getURL(r, r.flyer) : "",
    }));
  } catch {
    return [];
  }
}

/* ------------------------------------------------------------------ */
/* Reservations                                                        */
/* ------------------------------------------------------------------ */

export interface ReservationInput {
  ime: string;
  telefon: string;
  email?: string;
  tip: "sank" | "barski_sto" | "separe";
  paket: string;
  broj_osoba: number;
  event?: string;
  datum: string;
  poruka?: string;
}

/** Kreira rezervaciju u PocketBase-u (kolekcija "reservations"). */
export async function createReservation(data: ReservationInput) {
  const pb = getPocketBase();
  return pb.collection("reservations").create({
    ...data,
    status: "na_cekanju",
  });
}
