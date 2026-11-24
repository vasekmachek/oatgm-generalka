import { describe, expect, it } from "vitest";
import {
  formatujKc,
  kolikTenisek,
  nactiCenu,
  nactiDny,
  spocitejUtratu,
  tvarPar,
  vetaSrovnani,
} from "../src/vypocet";

describe("spocitejUtratu", () => {
  it("40 Kč × 5 dní dá 200 / 800 / 8 000 Kč", () => {
    expect(spocitejUtratu({ cena: 40, dny: 5 })).toEqual({ tyden: 200, mesic: 800, rok: 8000 });
  });

  it("počítá i s desetinnou cenou", () => {
    expect(spocitejUtratu({ cena: 12.5, dny: 2 })).toEqual({ tyden: 25, mesic: 100, rok: 1000 });
  });

  it("neplatný vstup vrátí nuly, ne nesmysl", () => {
    const nuly = { tyden: 0, mesic: 0, rok: 0 };
    expect(spocitejUtratu({ cena: -10, dny: 5 })).toEqual(nuly);
    expect(spocitejUtratu({ cena: NaN, dny: 5 })).toEqual(nuly);
    expect(spocitejUtratu({ cena: 40, dny: 0 })).toEqual(nuly);
    expect(spocitejUtratu({ cena: 40, dny: 6 })).toEqual(nuly);
  });
});

describe("nactiCenu", () => {
  it("přijme číslo i desetinnou čárku", () => {
    expect(nactiCenu("45")).toEqual({ ok: true, hodnota: 45 });
    expect(nactiCenu(" 39,90 ")).toEqual({ ok: true, hodnota: 39.9 });
    expect(nactiCenu("0")).toEqual({ ok: true, hodnota: 0 });
  });

  it("prázdné políčko, záporná cena a text vrátí hlášku", () => {
    for (const vstup of ["", "   ", "-5", "abc", "1e3", "12,5,3"]) {
      const v = nactiCenu(vstup);
      expect(v.ok).toBe(false);
      if (!v.ok) expect(v.chyba.length).toBeGreaterThan(0);
    }
  });

  it("odmítne nesmyslně vysokou cenu", () => {
    expect(nactiCenu("10001").ok).toBe(false);
  });
});

describe("nactiDny", () => {
  it("přijme 1–5 dní", () => {
    for (const d of [1, 2, 3, 4, 5]) expect(nactiDny(d)).toEqual({ ok: true, hodnota: d });
    expect(nactiDny("3")).toEqual({ ok: true, hodnota: 3 });
  });

  it("počet dní mimo rozsah 1–5 nepřijme", () => {
    for (const d of [0, -1, 6, 7, 2.5, NaN, "", "x", null, undefined]) {
      expect(nactiDny(d).ok).toBe(false);
    }
  });
});

describe("srovnání s teniskami", () => {
  it("vydělí roční částku cenou tenisek a zaokrouhlí dolů", () => {
    expect(kolikTenisek(8000)).toBe(5);
    expect(kolikTenisek(4499)).toBe(2);
    expect(kolikTenisek(1500)).toBe(1);
    expect(kolikTenisek(1499)).toBe(0);
    expect(kolikTenisek(3000, 1000)).toBe(3);
  });

  it("pro nulu nebo neplatnou částku vrátí 0", () => {
    expect(kolikTenisek(0)).toBe(0);
    expect(kolikTenisek(-100)).toBe(0);
    expect(kolikTenisek(NaN)).toBe(0);
  });

  it("skloňuje slovo pár", () => {
    expect(tvarPar(1)).toBe("pár");
    expect(tvarPar(3)).toBe("páry");
    expect(tvarPar(5)).toBe("párů");
  });

  it("sestaví větu", () => {
    expect(vetaSrovnani(4800)).toBe("To je jako 3 páry tenisek po 1 500 Kč.");
    expect(vetaSrovnani(8000)).toBe("To je jako 5 párů tenisek po 1 500 Kč.");
    expect(vetaSrovnani(100)).toBe("Na pár tenisek po 1 500 Kč to zatím nestačí.");
  });
});

describe("formatujKc", () => {
  it("odděluje tisíce a přidá Kč", () => {
    expect(formatujKc(0)).toBe("0 Kč");
    expect(formatujKc(800)).toBe("800 Kč");
    expect(formatujKc(8000)).toBe("8 000 Kč");
    expect(formatujKc(1234567)).toBe("1 234 567 Kč");
  });

  it("ukáže haléře jen když nějaké jsou", () => {
    expect(formatujKc(39.9)).toBe("39,90 Kč");
    expect(formatujKc(NaN)).toBe("0 Kč");
  });
});
