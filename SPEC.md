# Svačinometr

> Zadáš, kolik dáváš za svačinu a kolikrát týdně, a hned uvidíš, kolik to dělá za měsíc a za celý školní rok.

Aplikaci vymyslela třída (nápad #2), analýzu napsal Claude a schválil Václav.

## Pro koho

Studenti obchodní akademie, kteří si cestou do školy kupují svačinu nebo kafe a chtějí vědět, kolik peněz jim za rok takhle odejde. Stačí jim na to mobil a pár vteřin o přestávce.

## Co umí první verze

1. **Zadání ceny a počtu dní:** Dvě políčka: cena jedné svačiny v Kč a kolikrát týdně si ji kupuješ (1–5 dní).
2. **Výpočet za týden, měsíc a školní rok:** Aplikace hned ukáže tři částky. Školní rok počítá jako 40 týdnů a měsíc jako 4 týdny.
3. **Srovnání, co by sis za to mohl/a koupit:** Pod roční částkou se objeví jednoduchá věta, třeba „To je jako 3 páry tenisek po 1 500 Kč“, s jedním pevně daným příkladem.
4. **Uložení posledního zadání:** Když aplikaci zavřeš a znovu otevřeš, tvoje čísla tam pořád budou.

## Obrazovky

- Nahoře nadpis a krátká věta, k čemu aplikace je
- Formulář se dvěma políčky (cena svačiny, počet dní v týdnu)
- Karta s výsledky: týden, měsíc a školní rok, roční částka velkým písmem
- Řádek se srovnáním (kolik tenisek by to bylo)

## Data

Do localStorage se pod jedním klíčem ukládá jen poslední zadání jako JSON: cena svačiny a počet dní v týdnu, například {"cena": 45, "dny": 5}. Při spuštění se načte a výsledky se hned spočítají. Nic jiného se neukládá a nic se neodesílá.

## Co v první verzi nebude

- Grafy a historie výdajů v čase
- Víc druhů svačin nebo výdajů najednou (kafe, oběd, energiťáky zvlášť)
- Skutečné ceny z obchodů nebo bufetu
- Hlídání rozpočtu, upozornění a spořicí cíle
- Přesný školní kalendář s prázdninami a svátky

## Co ověří testy

- Výpočet: 40 Kč × 5 dní dá 200 Kč za týden, 800 Kč za měsíc a 8 000 Kč za školní rok
- Neplatný vstup (prázdné políčko, záporná cena nebo 0 dní) nevrátí nesmysl a ukáže 0 Kč nebo hlášku
- Počet dní mimo rozsah 1–5 se nepřijme
- Srovnání s teniskami správně vydělí roční částku cenou tenisek a zaokrouhlí dolů
- Uložení a načtení: po uložení zadání a znovunačtení stránky se vrátí stejné hodnoty

## Nápady na později

- Víc položek najednou (svačina, kafe, energiťák) se součtem za rok
- Režim „co kdybych“: o kolik víc by mi za rok zůstalo, kdybych si svačinu nosil/a z domu 2 dny v týdnu
- Vlastní cíl úspor, třeba „chci na festival za 2 500 Kč“, a kolik týdnů bez kupované svačiny to stojí

## Technika

Vite + TypeScript bez frameworku, testy ve Vitestu. Data jen v `localStorage`, žádný server.
