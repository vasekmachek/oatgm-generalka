import { describe, expect, it } from "vitest";
import { TYPY_SVACIN, najdiTypPodleId, popisekTypu, typPodleCeny } from "../src/typy";
import { nactiCenu } from "../src/vypocet";

describe("typy svačin", () => {
  it("mají jedinečná id a platné kladné ceny", () => {
    const id = TYPY_SVACIN.map((t) => t.id);
    expect(new Set(id).size).toBe(id.length);
    for (const t of TYPY_SVACIN) {
      expect(t.cena).toBeGreaterThan(0);
      expect(nactiCenu(String(t.cena)).ok).toBe(true);
    }
  });

  it("najde typ podle id", () => {
    expect(najdiTypPodleId("kafe")?.cena).toBe(45);
    expect(najdiTypPodleId("pizza")).toBeNull();
  });

  it("pozná typ podle ceny", () => {
    expect(typPodleCeny(65)?.id).toBe("bageta");
    expect(typPodleCeny(46)).toBeNull();
    expect(typPodleCeny(NaN)).toBeNull();
  });

  it("vytvoří popisek tlačítka", () => {
    expect(popisekTypu({ id: "kafe", nazev: "Kafe", ikona: "☕", cena: 45 })).toBe("☕ Kafe · 45 Kč");
  });
});
