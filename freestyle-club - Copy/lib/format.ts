/** Pomoćne funkcije za formatiranje datuma na srpskom. */

const MESECI = [
  "jan",
  "feb",
  "mar",
  "apr",
  "maj",
  "jun",
  "jul",
  "avg",
  "sep",
  "okt",
  "nov",
  "dec",
];

const DANI = ["NED", "PON", "UTO", "SRE", "ČET", "PET", "SUB"];

function parse(datum: string): Date | null {
  if (!datum) return null;
  // PocketBase vraća npr. "2026-06-15 23:30:00.000Z" — normalizujemo razmak u "T".
  const d = new Date(datum.replace(" ", "T"));
  return Number.isNaN(d.getTime()) ? null : d;
}

/** "15. jun 2026." */
export function formatDateSr(datum: string): string {
  const d = parse(datum);
  if (!d) return "";
  return `${d.getDate()}. ${MESECI[d.getMonth()]} ${d.getFullYear()}.`;
}

/** Vraća { dan: "15", mesec: "JUN", dow: "PET" } za prikaz na flyer kartici. */
export function formatDateParts(datum: string): {
  dan: string;
  mesec: string;
  dow: string;
} {
  const d = parse(datum);
  if (!d) return { dan: "--", mesec: "", dow: "" };
  return {
    dan: String(d.getDate()).padStart(2, "0"),
    mesec: MESECI[d.getMonth()].toUpperCase(),
    dow: DANI[d.getDay()],
  };
}

/** ISO datum "YYYY-MM-DD" za <input type="date"> vrednost. */
export function toDateInputValue(datum: string): string {
  const d = parse(datum);
  if (!d) return "";
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}
