<p align="center">
  <img src="screenshots/logo.jpg" alt="Gymprogram logo" width="300"/>
</p>

# Gymprogram — Databasprojekt

Mitt skolprojekt som modellerar ett gymprogram-system i både **MariaDB (SQL)** och **MongoDB (NoSQL)**.
Projektet täcker databasdesign, normalisering, ER-diagram och jämförelse mellan relationell och dokumentbaserad databas. Jag jämför skillnaden mellan mongoDB och SQL.

Har samlat mina frågeställningar med ord/begrepp som jag tyckt vart svåra att förstå.

---

## Innehåll

```
gymprogram/
├── sql/
│   ├── schema.sql        # DDL — skapar alla tabeller
│   ├── data.sql          # Testdata
│   └── queries.sql       # SELECT-frågor (JOIN, GROUP BY, HAVING, CASE)
├── mongodb/
│   ├── collections.js    # Skapar och fyller collections i mongosh
│   └── queries.js        # MongoDB-frågor
├── docs/
│   ├── er-crowfoot.md    # ER-diagram (crow's foot-notation)
│   ├── er-flowchart.md   # ER-diagram (flödesnotation)
│   └── er-legend.md      # Förklaring av notationer
├── guides/               # Installationsguider och förklaringar
├── diagrams/             # ER-bilder
├── screenshots/          # Körda queries med resultat
├── mongodb-vs-sql.js     # Jämförelse SQL ↔ MongoDB
└── normalization.xlsx    # Normaliseringsanalys (1NF → 3NF)
```

---

## Databasschema (SQL)

Sju tabeller normaliserade till **3NF**:

| Tabell                | Beskrivning                                            |
| --------------------- | ------------------------------------------------------ |
| `PT`                  | Personal trainers                                      |
| `Person`              | Medlemmar som bokar program                            |
| `Program`             | Träningsprogram (kan ha en PT)                         |
| `Exercise`            | Enskilda övningar (t.ex. bänkpress)                    |
| `MuscleGroup`         | Muskelgrupper (t.ex. bröst, ben)                       |
| `Program_Exercise`    | Kopplingstabell Program ↔ Exercise (M:N) med sets/reps |
| `Program_MuscleGroup` | Kopplingstabell Program ↔ MuscleGroup (M:N)            |
| `Booking`             | Bokning — kopplar Person till Program med datum        |

---

## MongoDB-struktur

Tre collections med **embedding** och **referens** som designval:

- `programs` — övningar och muskelgrupper är inbäddade som arrayer
- `persons` — persondata
- `bookings` — refererar till `person_id` och `program_id` (ej embedding)

---

## Kom igång

### MariaDB

```bash
mysql -u root -p < sql/schema.sql
mysql -u root -p gymprogram < sql/data.sql
mysql -u root -p gymprogram < sql/queries.sql
```

### MongoDB

```bash
mongosh
load("mongodb/collections.js")
load("mongodb/queries.js")
```

---

## Tekniker

- MariaDB / MySQL
- MongoDB / mongosh
- SQL (DDL, DML, SELECT med JOIN, GROUP BY, HAVING, CASE WHEN)
- ER-diagram (crow's foot-notation)
- Normalisering 1NF → 3NF
