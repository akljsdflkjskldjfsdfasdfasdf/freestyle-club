/**
 * ──────────────────────────────────────────────────────────────────────────
 *  CENE I PAKETI REZERVACIJA — sve vrednosti su PLACEHOLDER.
 *  Ovde menjaš nazive, cene i sadržaj paketa. Ništa drugo ne treba da diraš.
 * ──────────────────────────────────────────────────────────────────────────
 */

export type ReservationTypeId = "sank" | "barski_sto" | "separe";
export type AccentColor = "cyan" | "magenta" | "violet";

export interface PackageOption {
  /** Stabilan id koji se upisuje u PocketBase (polje "paket"). */
  id: string;
  /** Naziv paketa koji vidi korisnik. */
  name: string;
  /** Cena (placeholder tekst — slobodno menjaj format). */
  price: string;
  /** Kratka oznaka, npr "NAJTRAŽENIJE" (opciono). */
  tag?: string;
  /** Šta paket uključuje. */
  includes: string[];
}

export interface ReservationType {
  id: ReservationTypeId;
  /** Naziv tipa (naslov kartice). */
  name: string;
  /** Kratak podnaslov. */
  short: string;
  /** Opis za karticu. */
  description: string;
  /** Gde se nalazi u rasporedu splava (prsten). */
  ring: string;
  /** "od" cena prikazana na kartici. */
  priceFrom: string;
  /** Neon akcenat kartice. */
  accent: AccentColor;
  /** Paketi/nivoi za ovaj tip. */
  packages: PackageOption[];
}

export const reservationTypes: ReservationType[] = [
  {
    id: "sank",
    name: "Šank",
    short: "Visoko sedenje / ulaz po osobi",
    description:
      "Mesto u srcu žurke, uz veliki centralni šank. Najbolji izbor za manje društvo i one koji žele da budu tamo gde se sve dešava.",
    ring: "Centar — veliki šank",
    priceFrom: "od 500 RSD / osobi",
    accent: "cyan",
    packages: [
      {
        id: "sank-ulaz",
        name: "Ulaz po osobi",
        price: "500 RSD / osobi",
        includes: [
          "Garantovan ulaz u klub",
          "Mesto za visokim šankom",
          "Pristup centralnom baru",
        ],
      },
    ],
  },
  {
    id: "barski_sto",
    name: "Barski sto",
    short: "Sto + flaša + ulaznice za društvo",
    description:
      "Visoki barski sto u srednjem prstenu — vaše mesto za celo veče. Paket uključuje flašu i ulaznice za društvo.",
    ring: "Srednji prsten — barski stolovi",
    priceFrom: "od 12.000 RSD",
    accent: "magenta",
    packages: [
      {
        id: "barski-standard",
        name: "Barski sto — Standard",
        price: "12.000 RSD",
        tag: "NAJTRAŽENIJE",
        includes: [
          "Rezervacija barskog stola",
          "1× flaša žestokog pića po izboru",
          "Ulaznice za društvo (do 4 osobe)",
          "Miks, led i posluga",
        ],
      },
      {
        id: "barski-plus",
        name: "Barski sto — Plus",
        price: "20.000 RSD",
        includes: [
          "Rezervacija barskog stola",
          "2× flaša žestokog pića po izboru",
          "Ulaznice za društvo (do 6 osoba)",
          "Miks, led i posluga",
        ],
      },
    ],
  },
  {
    id: "separe",
    name: "Separe (VIP)",
    short: "Privatnost, premium flaša, šampanjac",
    description:
      "Spoljni prsten — privatni separei za vaše društvo. Tri nivoa luksuza, premium flaše i šampanjac uz punu poslugu.",
    ring: "Spoljni prsten — separei",
    priceFrom: "od 35.000 RSD",
    accent: "violet",
    packages: [
      {
        id: "separe-sofa",
        name: "Sofa",
        price: "35.000 RSD",
        includes: [
          "Privatni separe (do 6 osoba)",
          "1× premium flaša",
          "1× flaša šampanjca",
          "Miks, led i dedikovana posluga",
        ],
      },
      {
        id: "separe-vip-sofa",
        name: "VIP Sofa",
        price: "60.000 RSD",
        tag: "NAJBOLJI IZBOR",
        includes: [
          "Veći VIP separe (do 10 osoba)",
          "2× premium flaša",
          "2× flaša šampanjca",
          "Prskalice uz serviranje flaša",
          "Dedikovana posluga celo veče",
        ],
      },
      {
        id: "separe-ultra-vip",
        name: "Ultra VIP",
        price: "120.000 RSD",
        includes: [
          "Najbolji separe na splavu (do 15 osoba)",
          "4× premium / top-shelf flaša",
          "3× flaša šampanjca (premium)",
          "Spektakl uz prskalice i šampanjac",
          "Lični host i prioritetan ulaz",
        ],
      },
    ],
  },
];

export function getReservationType(id: ReservationTypeId): ReservationType {
  const found = reservationTypes.find((t) => t.id === id);
  // reservationTypes uvek sadrži sva tri tipa, ali zadržavamo fallback radi tipova
  return found ?? reservationTypes[0];
}
