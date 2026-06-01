import type { AppEvent } from "./pocketbase";

/**
 * Statične „prestojeće žurke" — prikazuju se kad PocketBase nema unetih
 * događaja (npr. dok se backend ne poveže). Čim PB ima aktivne događaje,
 * oni imaju prednost (vidi app/page.tsx).
 *
 * FLAJERI: stavi slike u  public/events/  pod ovim tačnim imenima:
 *   public/events/heatwave.jpg
 *   public/events/get-low.jpg
 *   public/events/lean-on.jpg
 * Ako slika fali, kartica lepo prikaže gradijent sa imenom žurke (fallback).
 *
 * Napomena: vreme NEMA "Z" namerno — koristi se lokalna vremenska zona,
 * da dan u nedelji (PET/SUB/NED) odgovara flajeru.
 */
export const featuredEvents: AppEvent[] = [
  {
    id: "heatwave",
    naziv: "Heatwave",
    datum: "2026-05-29 23:30:00",
    lineup: "DJ Ike · DJ Simun",
    opis: "Letnji vrhunac sezone — najjači zvuk i provod na vodi.",
    flyerUrl: "/events/heatwave.jpg",
  },
  {
    id: "get-low",
    naziv: "Get Low",
    datum: "2026-05-30 23:30:00",
    lineup: "DJ Simun",
    opis: "Subotnja žurka u pink Miami izdanju.",
    flyerUrl: "/events/get-low.jpg",
  },
  {
    id: "lean-on",
    naziv: "Lean On",
    datum: "2026-05-31 23:30:00",
    lineup: "Architect & Ike · Cheap Monkeys",
    opis: "Retrowave nedelja — savršen vibe za kraj vikenda.",
    flyerUrl: "/events/lean-on.jpg",
  },
];
