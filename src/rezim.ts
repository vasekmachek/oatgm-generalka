// Světlý / tmavý režim. Volba se ukládá jen v telefonu (localStorage).
import type { Uloziste } from "./uloziste";

export type Rezim = "svetly" | "tmavy";

export const KLIC_REZIM = "svacinometr:rezim";

/** Přepne na opačný režim. */
export function prepniRezim(rezim: Rezim): Rezim {
  return rezim === "tmavy" ? "svetly" : "tmavy";
}

/** Uložená volba má přednost, jinak se řídíme nastavením telefonu. */
export function vyberRezim(ulozeny: Rezim | null, systemTmavy: boolean): Rezim {
  return ulozeny ?? (systemTmavy ? "tmavy" : "svetly");
}

export function nactiRezim(uloziste: Uloziste): Rezim | null {
  try {
    const text = uloziste.getItem(KLIC_REZIM);
    return text === "svetly" || text === "tmavy" ? text : null;
  } catch {
    return null;
  }
}

export function ulozRezim(uloziste: Uloziste, rezim: Rezim): void {
  try {
    uloziste.setItem(KLIC_REZIM, rezim);
  } catch {
    // Bez úložiště to funguje dál, jen si volbu nezapamatujeme.
  }
}

/** Text tlačítka: co se stane po kliknutí. */
export function textTlacitka(rezim: Rezim): string {
  return rezim === "tmavy" ? "☀️ Světlý režim" : "🌙 Tmavý režim";
}
