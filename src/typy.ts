// Hotové typy svačin, které jedním klepnutím doplní cenu.

export interface TypSvaciny {
  id: string;
  nazev: string;
  ikona: string;
  cena: number;
}

export const TYPY_SVACIN: readonly TypSvaciny[] = [
  { id: "rohlik", nazev: "Rohlík", ikona: "🥖", cena: 25 },
  { id: "croissant", nazev: "Croissant", ikona: "🥐", cena: 35 },
  { id: "kafe", nazev: "Kafe", ikona: "☕", cena: 45 },
  { id: "bageta", nazev: "Bageta", ikona: "🥪", cena: 65 },
];

/** Najde typ svačiny podle id. */
export function najdiTypPodleId(id: string, typy: readonly TypSvaciny[] = TYPY_SVACIN): TypSvaciny | null {
  return typy.find((t) => t.id === id) ?? null;
}

/** Najde typ, jehož cena odpovídá zadané ceně (pro zvýraznění tlačítka). */
export function typPodleCeny(cena: number, typy: readonly TypSvaciny[] = TYPY_SVACIN): TypSvaciny | null {
  if (!Number.isFinite(cena)) return null;
  return typy.find((t) => t.cena === cena) ?? null;
}

/** Text tlačítka, např. „☕ Kafe · 45 Kč“. */
export function popisekTypu(typ: TypSvaciny): string {
  return `${typ.ikona} ${typ.nazev} · ${typ.cena} Kč`;
}
