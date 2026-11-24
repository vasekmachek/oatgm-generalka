// Čisté funkce pro výpočet útraty za svačiny.

export const TYDNU_V_MESICI = 4;
export const TYDNU_VE_SKOLNIM_ROCE = 40;
export const MIN_DNU = 1;
export const MAX_DNU = 5;
export const MAX_CENA = 10000;
export const CENA_TENISEK = 1500;

export type Vysledek<T> = { ok: true; hodnota: T } | { ok: false; chyba: string };

export interface Zadani {
  cena: number;
  dny: number;
}

export interface Utrata {
  tyden: number;
  mesic: number;
  rok: number;
}

/** Převede text z políčka na cenu v Kč. Přijme i desetinnou čárku. */
export function nactiCenu(text: string): Vysledek<number> {
  const upraveny = text.trim().replace(/\s/g, "").replace(",", ".");
  if (upraveny === "") return { ok: false, chyba: "Zadej cenu svačiny." };
  if (!/^-?\d+(\.\d+)?$/.test(upraveny)) return { ok: false, chyba: "Cena musí být číslo." };
  const cena = Number(upraveny);
  if (cena < 0) return { ok: false, chyba: "Cena nemůže být záporná." };
  if (cena > MAX_CENA) return { ok: false, chyba: "Tak drahá svačina? Zadej max. 10 000 Kč." };
  return { ok: true, hodnota: cena };
}

/** Ověří počet dní v týdnu (celé číslo 1–5). */
export function nactiDny(hodnota: unknown): Vysledek<number> {
  const dny = typeof hodnota === "string" ? Number(hodnota.trim()) : hodnota;
  if (typeof dny !== "number" || !Number.isInteger(dny) || dny < MIN_DNU || dny > MAX_DNU) {
    return { ok: false, chyba: "Vyber 1 až 5 dní v týdnu." };
  }
  return { ok: true, hodnota: dny };
}

/** Spočítá útratu za týden, měsíc a školní rok. Neplatný vstup dá samé nuly. */
export function spocitejUtratu(zadani: Zadani): Utrata {
  const cenaOk = Number.isFinite(zadani.cena) && zadani.cena >= 0;
  const dnyOk = nactiDny(zadani.dny).ok;
  if (!cenaOk || !dnyOk) return { tyden: 0, mesic: 0, rok: 0 };
  const tyden = Math.round(zadani.cena * zadani.dny * 100) / 100;
  return {
    tyden,
    mesic: Math.round(tyden * TYDNU_V_MESICI * 100) / 100,
    rok: Math.round(tyden * TYDNU_VE_SKOLNIM_ROCE * 100) / 100,
  };
}

/** Kolik celých párů tenisek by se dalo koupit (zaokrouhleno dolů). */
export function kolikTenisek(rocniCastka: number, cenaTenisek: number = CENA_TENISEK): number {
  if (!Number.isFinite(rocniCastka) || rocniCastka <= 0 || cenaTenisek <= 0) return 0;
  return Math.floor(rocniCastka / cenaTenisek);
}

/** Správný tvar slova „pár“ podle počtu. */
export function tvarPar(pocet: number): string {
  if (pocet === 1) return "pár";
  if (pocet >= 2 && pocet <= 4) return "páry";
  return "párů";
}

/** Formátuje částku v Kč s mezerami mezi tisíci (např. „8 000 Kč“). */
export function formatujKc(castka: number): string {
  const bezpecna = Number.isFinite(castka) ? castka : 0;
  const zaokrouhlena = Math.round(bezpecna * 100) / 100;
  const [cela, des] = Math.abs(zaokrouhlena).toFixed(2).split(".");
  const tisice = cela.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const znamenko = zaokrouhlena < 0 ? "−" : "";
  const desetinna = des === "00" ? "" : `,${des}`;
  return `${znamenko}${tisice}${desetinna} Kč`;
}

/** Věta se srovnáním roční útraty s teniskami. */
export function vetaSrovnani(rocniCastka: number, cenaTenisek: number = CENA_TENISEK): string {
  const pocet = kolikTenisek(rocniCastka, cenaTenisek);
  const cena = formatujKc(cenaTenisek);
  if (pocet === 0) return `Na pár tenisek po ${cena} to zatím nestačí.`;
  return `To je jako ${pocet} ${tvarPar(pocet)} tenisek po ${cena}.`;
}
