import { describe, expect, it } from "vitest";
import { KLIC_REZIM, nactiRezim, prepniRezim, textTlacitka, ulozRezim, vyberRezim } from "../src/rezim";
import type { Uloziste } from "../src/uloziste";

function falesneUloziste(): Uloziste & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => void data.set(k, v),
  };
}

describe("tmavý režim", () => {
  it("přepínač střídá světlý a tmavý režim", () => {
    expect(prepniRezim("svetly")).toBe("tmavy");
    expect(prepniRezim("tmavy")).toBe("svetly");
  });

  it("bez uložené volby se řídí nastavením telefonu", () => {
    expect(vyberRezim(null, true)).toBe("tmavy");
    expect(vyberRezim(null, false)).toBe("svetly");
  });

  it("uložená volba má přednost před telefonem", () => {
    expect(vyberRezim("svetly", true)).toBe("svetly");
    expect(vyberRezim("tmavy", false)).toBe("tmavy");
  });

  it("po uložení a načtení vrátí stejný režim", () => {
    const u = falesneUloziste();
    ulozRezim(u, "tmavy");
    expect(u.data.get(KLIC_REZIM)).toBe("tmavy");
    expect(nactiRezim(u)).toBe("tmavy");
  });

  it("neplatnou nebo chybějící hodnotu ignoruje", () => {
    const u = falesneUloziste();
    expect(nactiRezim(u)).toBeNull();
    u.data.set(KLIC_REZIM, "ruzovy");
    expect(nactiRezim(u)).toBeNull();
  });

  it("nespadne, když úložiště nejde použít", () => {
    const rozbite: Uloziste = {
      getItem: () => { throw new Error("zakázáno"); },
      setItem: () => { throw new Error("plno"); },
    };
    expect(() => ulozRezim(rozbite, "tmavy")).not.toThrow();
    expect(nactiRezim(rozbite)).toBeNull();
  });

  it("tlačítko nabízí opačný režim", () => {
    expect(textTlacitka("svetly")).toContain("Tmavý");
    expect(textTlacitka("tmavy")).toContain("Světlý");
  });
});
