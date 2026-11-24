import { describe, expect, it } from "vitest";
import { KLIC, nactiZadani, ulozZadani, type Uloziste } from "../src/uloziste";

function falesneUloziste(): Uloziste & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => void data.set(k, v),
  };
}

describe("uložení zadání", () => {
  it("po uložení a znovunačtení vrátí stejné hodnoty", () => {
    const u = falesneUloziste();
    ulozZadani(u, { cena: 45, dny: 5 });
    expect(nactiZadani(u)).toEqual({ cena: 45, dny: 5 });
  });

  it("ukládá jen cenu a dny jako JSON pod jedním klíčem", () => {
    const u = falesneUloziste();
    ulozZadani(u, { cena: 39.9, dny: 3 });
    expect([...u.data.keys()]).toEqual([KLIC]);
    expect(JSON.parse(u.data.get(KLIC)!)).toEqual({ cena: 39.9, dny: 3 });
  });

  it("bez uložených dat vrátí null", () => {
    expect(nactiZadani(falesneUloziste())).toBeNull();
  });

  it("poškozená nebo neplatná data ignoruje", () => {
    for (const text of ["{nejde", "42", "null", '{"cena":-1,"dny":3}', '{"cena":40,"dny":9}', '{"cena":"40","dny":3}']) {
      const u = falesneUloziste();
      u.data.set(KLIC, text);
      expect(nactiZadani(u)).toBeNull();
    }
  });

  it("nespadne, když úložiště nejde použít", () => {
    const rozbite: Uloziste = {
      getItem: () => { throw new Error("zakázáno"); },
      setItem: () => { throw new Error("plno"); },
    };
    expect(() => ulozZadani(rozbite, { cena: 40, dny: 5 })).not.toThrow();
    expect(nactiZadani(rozbite)).toBeNull();
  });
});
