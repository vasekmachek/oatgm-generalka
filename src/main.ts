import "./style.css";
import { APP } from "./app";
import { formatujKc, nactiCenu, nactiDny, spocitejUtratu, vetaSrovnani } from "./vypocet";
import { nactiZadani, ulozZadani } from "./uloziste";

const $ = <T extends Element>(sel: string) => document.querySelector<T>(sel)!;

$<HTMLHeadingElement>("#name").textContent = APP.name;
$<HTMLParagraphElement>("#tagline").textContent = APP.tagline;
document.title = APP.name;

const formular = $<HTMLFormElement>("#formular");
const cenaInput = $<HTMLInputElement>("#cena");
const cenaChyba = $<HTMLParagraphElement>("#cena-chyba");
const vystupTyden = $<HTMLElement>("#tyden");
const vystupMesic = $<HTMLElement>("#mesic");
const vystupRok = $<HTMLElement>("#rok");
const vystupSrovnani = $<HTMLElement>("#srovnani");

function vybraneDny(): string {
  return formular.querySelector<HTMLInputElement>('input[name="dny"]:checked')?.value ?? "";
}

function ukazChybu(text: string | null): void {
  cenaChyba.hidden = text === null;
  cenaChyba.textContent = text ?? "";
  cenaInput.setAttribute("aria-invalid", text === null ? "false" : "true");
}

function prepocitej(ulozit: boolean): void {
  const cena = nactiCenu(cenaInput.value);
  const dny = nactiDny(vybraneDny());

  // Prázdné políčko není chyba, jen ještě nic nezadal/a.
  const prazdne = cenaInput.value.trim() === "";
  ukazChybu(!cena.ok && !prazdne ? cena.chyba : null);

  if (!cena.ok || !dny.ok) {
    vystupTyden.textContent = formatujKc(0);
    vystupMesic.textContent = formatujKc(0);
    vystupRok.textContent = formatujKc(0);
    vystupSrovnani.textContent = prazdne ? "Zadej cenu svačiny a uvidíš." : "Oprav zadání a hned to spočítám.";
    return;
  }

  const zadani = { cena: cena.hodnota, dny: dny.hodnota };
  const utrata = spocitejUtratu(zadani);
  vystupTyden.textContent = formatujKc(utrata.tyden);
  vystupMesic.textContent = formatujKc(utrata.mesic);
  vystupRok.textContent = formatujKc(utrata.rok);
  vystupSrovnani.textContent = vetaSrovnani(utrata.rok);
  if (ulozit) ulozZadani(localStorage, zadani);
}

const ulozene = nactiZadani(localStorage);
if (ulozene) {
  cenaInput.value = String(ulozene.cena).replace(".", ",");
  const radio = formular.querySelector<HTMLInputElement>(`input[name="dny"][value="${ulozene.dny}"]`);
  if (radio) radio.checked = true;
}

formular.addEventListener("input", () => prepocitej(true));
formular.addEventListener("submit", (e) => {
  e.preventDefault();
  prepocitej(true);
});

prepocitej(false);
