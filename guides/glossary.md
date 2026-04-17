# Databas-ordlista — Cheat Sheet

---

## Snabbkort — Normalformer (lär dig detta först)

Kör dessa tre frågor på varje tabell, i ordning:

> **1. Har varje cell bara ETT värde?** → 1NF
> **2. Beror allt på HELA nyckeln?** → 2NF
> **3. Pratar kolumnerna med varandra?** → 3NF

| Vad                 | Kom ihåg                                                   |
| ------------------- | ---------------------------------------------------------- |
| 1NF                 | En cell = ett värde                                        |
| 2NF                 | Hoppa om enkel nyckel. Annars: behöver jag båda nycklarna? |
| 3NF                 | Gossip — kolumner pratar inte om varandra                  |
| Partiellt beroende  | Halva nyckeln räcker — fel (bryter 2NF)                    |
| Transitivt beroende | A→B→C i samma tabell — fel (bryter 3NF)                    |

---

## Minnesregler

**1NF — Parkeringsregeln**
En parkeringsruta = en bil. En cell = ett värde.
Inte `"bröst, rygg, ben"` i en cell — det är tre bilar på en ruta.

**2NF — Gäller bara när du har TVÅ nycklar**
Om du bara har en nyckel → hoppa direkt till 3NF, 2NF är automatiskt okej.
Om du har två nycklar: kan du ta bort en och fortfarande veta svaret? Då är något fel.
_"Behöver jag båda för att veta svaret?"_ — Ja = bra. Nej = problem.

**3NF — Gossip-regeln**
Kolumner får inte skvallra om varandra.
`pt_id → pt_namn` — om `pt_namn` finns i Program-tabellen "skvallrar" den om PT. Fel.
PT:ens namn hör hemma i PT-tabellen.

---

## Normalformer — längre förklaringar

**Normalisering**
Processen att städa upp en databas så att data inte upprepas och är lätt att uppdatera.

**1NF (Första normalformen)**
Varje cell får bara ha ETT värde. Inte en lista som `"bröst, rygg, ben"` i en cell — det ska vara separata rader.

**2NF (Andra normalformen)**
Gäller bara tabeller med sammansatt PK (två primärnycklar).
Alla andra kolumner måste bero på BÅDA nycklarna, inte bara en av dem.

**3NF (Tredje normalformen)**
Ingen vanlig kolumn får bestämma en annan vanlig kolumn.
Exempel: om du har `postnummer → stad` i en tabell bryter det mot 3NF — stad ska vara i en egen tabell.

---

## Nycklar

**Primärnyckel (PK)**
Den kolumn som unikt identifierar varje rad. Ingen rad får ha samma PK-värde.

**Sammansatt primärnyckel**
När man behöver TVÅ kolumner tillsammans för att identifiera en rad unikt. Används i kopplingstabeller.

**Foreign key (FK)**
En kolumn som pekar på en primärnyckel i en annan tabell. Skapar kopplingen mellan tabeller.

---

## Beroenden

**Atomär**
Att ett värde inte kan/ska delas upp mer. `"Erik"` är atomärt. `"Erik Johansson"` i en cell är det inte om man vill kunna söka på förnamn och efternamn separat.

**Partiellt beroende**
När en kolumn bara beror på EN del av en sammansatt PK, inte hela.
Exempel: om `exercise_name` låg i `Program_Exercise` och bara berodde på `exercise_id` — det vore partiellt beroende och bryter mot 2NF.

**Transitivt beroende**
När kolumn A → kolumn B → kolumn C. C beror inte direkt på PK utan via B.
Exempel: `program_id → pt_id → pt_name`. Om `pt_name` låg i Program-tabellen vore det transitivt — det bryter mot 3NF.

---

## Samband och tabeller

**Kopplingstabell**
En extra tabell som löser ett M:N-samband. Innehåller bara de två FK:erna (och ibland extra info som `sets`, `reps`).

**M:N (Många-till-många)**
Ett samband där båda sidor kan ha flera. Ett program har många övningar, och en övning kan finnas i många program.

**1:N (En-till-många)**
En PT kan leda många program, men ett program har max en PT.

---

## Anomalier

**Redundans**
Samma data lagras på flera ställen. Om en PT byter e-post måste varje rad med den e-posten uppdateras — missar man en rad är datan inkonsistent.

**Anomali**
Ett fel som uppstår vid INSERT, UPDATE eller DELETE på grund av dålig databasstruktur.

**Uppdateringsanomali**
Data finns på flera ställen — en ändring måste göras överallt. Missas en rad uppstår inkonsistens.

**Raderingsanomali**
Att ta bort en rad tar oavsiktligt med sig annan information. Raderas den enda bokningen för ett program försvinner programinfo om den inte finns på annat håll.

**Icke-nyckelattribut**
En vanlig kolumn som varken är primärnyckel eller FK — t.ex. `first_name`, `price`.

---

## MongoDB-specifikt

**Projektion**
Att välja vilka fält som ska visas i resultatet. Som `SELECT namn, pris` istället för `SELECT *`.

**Aggregeringspipeline**
En serie steg som bearbetar data i ordning. Typ: samla ihop → räkna → sortera.
