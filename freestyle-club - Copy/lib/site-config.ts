/**
 * ──────────────────────────────────────────────────────────────────────────
 *  OPŠTI PODACI O KLUBU — telefoni, lokacija, radno vreme, društvene mreže.
 *  Sve su PLACEHOLDER vrednosti. Ovde menjaš kontakt i lokaciju.
 *  (Cene paketa se menjaju u lib/reservations-config.ts)
 * ──────────────────────────────────────────────────────────────────────────
 */

export const siteConfig = {
  name: "FREESTYLER",
  tagline: "Reka. Ritam. Bezgranična noć.",
  description:
    "Freestyler — legendarni rečni splav na Savi u Beogradu. House, RnB, Hip-Hop i Disco, preko 10 godina najjačeg provoda. Rezerviši separe, barski sto ili šank online.",

  /** Koristi se za metadataBase / Open Graph. Zameni pravim domenom. */
  url: "https://freestyler.rs",

  /** OG slika (1200×630) — stavi fajl u /public sa ovim imenom. */
  ogImage: "/og-image.jpg",

  /** Telefoni za rezervacije (placeholder brojevi). */
  phones: [
    { label: "Rezervacije", number: "+381 60 123 4567", href: "tel:+381601234567" },
    { label: "VIP / Separei", number: "+381 60 765 4321", href: "tel:+381607654321" },
  ],

  /** Društvene mreže (placeholder linkovi). */
  socials: {
    instagram: "https://instagram.com/freestyler",
    facebook: "https://facebook.com/freestyler",
    tiktok: "https://tiktok.com/@freestyler",
  },

  /** Lokacija splava (placeholder adresa i koordinate — Sava, Beograd). */
  location: {
    address: "Splav Freestyler, Savski kej bb",
    city: "Beograd",
    lat: 44.8155,
    lng: 20.449,
  },

  /** Radno vreme (placeholder). */
  hours: [
    { days: "Sreda", time: "23:30 – 05:00" },
    { days: "Petak – Subota", time: "23:30 – 05:00" },
  ],
  workingHoursShort: "23:30 – 05:00",
} as const;

/** Google Maps link "Otvori na mapi". */
export function getMapsLink(): string {
  const { lat, lng } = siteConfig.location;
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

/** Embed URL za <iframe> mapu (bez API ključa). */
export function getMapsEmbed(): string {
  const { lat, lng } = siteConfig.location;
  return `https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
}
