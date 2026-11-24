// Uložení posledního zadání do localStorage (jen v telefonu).
import { nactiDny, type Zadani } from "./vypocet";

export const KLIC = "svacinometr:zadani";

/** Část rozhraní Storage, kterou potřebujeme (kvůli testům). */
export interface Uloziste {
  getItem(klic: string): string | null;
  setItem(klic: string, hodnota: string): void;
}

export function ulozZadani(uloziste: Uloziste, zadani: Zadani): void {
  try {
    uloziste.setItem(KLIC, JSON.stringify({ cena: zadani.cena, dny: zadani.dny }));
  } catch {
    // Úložiště může být plné nebo zakázané. Aplikace funguje i bez něj.
  }
}

export function nactiZadani(uloziste: Uloziste): Zadani | null {
  try {
    const text = uloziste.getItem(KLIC);
    if (!text) return null;
    const data: unknown = JSON.parse(text);
    if (typeof data !== "object" || data === null) return null;
    const { cena, dny } = data as Record<string, unknown>;
    if (typeof cena !== "number" || !Number.isFinite(cena) || cena < 0) return null;
    if (!nactiDny(dny).ok) return null;
    return { cena, dny: dny as number };
  } catch {
    return null;
  }
}
