# Designval — förklaringar

## INNER JOIN vs LEFT JOIN

LEFT JOIN visar alla rader oavsett om det finns en matchning på andra sidan.
INNER JOIN visar bara rader där det finns en matchning på båda sidor.

I detta projekt används LEFT JOIN när program utan PT ska inkluderas i resultatet.
Hade INNER JOIN använts hade självträningsprogram (där `pt_id` är NULL) dolts — vilket ger ett ofullständigt svar.

**Tumregel:** Ska alla rader visas även utan koppling → LEFT JOIN. Ska bara kompletta par visas → INNER JOIN.

---

## ON DELETE — CASCADE vs SET NULL

**CASCADE** används på `Booking.person_id` och `Booking.program_id`.
Om en person eller ett program raderas tas alla tillhörande bokningar bort automatiskt.
Alternativet vore bokningar som pekar på något som inte längre finns — trasig referensintegritet.

**SET NULL** används på `Program.pt_id`.
Om en PT tas bort sätts `pt_id` till NULL istället för att radera programmet.
Programmet överlever sin PT och blir ett självträningsprogram.

---

## Varför är PT en egen tabell?

Om PT-namnet lagrades direkt i `Program` skulle ett namnbyte kräva att varje rad med det namnet uppdateras.
Med PT som egen tabell räcker en ändring på en rad. FK-referensen garanterar dessutom att `pt_id` alltid pekar på en existerande PT.

---

## PRIMARY KEY vs UNIQUE

Primärnyckeln identifierar varje rad unikt — den kan aldrig vara NULL och måste vara unik.
UNIQUE hindrar dubbletter men tillåter NULL-värden.

I detta projekt används UNIQUE på `email` i både `Person` och `PT` — två personer kan inte ha samma e-postadress, men email är inte identifieraren för raden.

---

## Deltagandetyp

Deltagandetyp beskriver om en entitet måste eller får delta i ett samband.

- `Booking.person_id` är NOT NULL — en bokning måste ha en person (obligatoriskt deltagande)
- `Program.pt_id` är NULL — ett program behöver inte ha en PT (valfritt deltagande)

---

## Varför DECIMAL och inte FLOAT för pris?

FLOAT lagrar ungefärliga värden och kan ge avrundningsfel vid beräkningar.
DECIMAL är exakt och passar för monetära värden där precision krävs.
