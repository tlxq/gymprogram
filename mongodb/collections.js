// ============================================================
// Gymprogram — collections.js
// Kör i mongosh: load("collections.js")
// ============================================================

// Väljer (eller skapar) databasen "gymprogram".
// Om den inte finns skapas den automatiskt när data infogas.
use("gymprogram");

// Tar bort samlingarna om de redan finns.
// Gör att vi kan köra filen flera gånger utan dubletter.
db.programs.drop();
db.persons.drop();
db.bookings.drop();

// ------------------------------------------------------------
// persons — samma data som Person-tabellen i MariaDB
// _id sätts manuellt (1–5) så att booking-dokumenten
// kan referera till rätt person med person_id.
// ------------------------------------------------------------
db.persons.insertMany([
  { _id: 1, first_name: "Erik",  last_name: "Svensson",  email: "erik.svensson@mail.se"  },
  { _id: 2, first_name: "Maja",  last_name: "Johansson", email: "maja.johansson@mail.se"  },
  { _id: 3, first_name: "Oscar", last_name: "Nilsson",   email: "oscar.nilsson@mail.se"   },
  { _id: 4, first_name: "Lina",  last_name: "Karlsson",  email: "lina.karlsson@mail.se"   },
  { _id: 5, first_name: "Johan", last_name: "Persson",   email: "johan.persson@mail.se"   },
]);

// ------------------------------------------------------------
// programs
//
// I MongoDB bäddar vi in (embedding) övningar och muskelgrupper
// direkt i program-dokumentet som arrayer.
// I SQL hade de legat i separata tabeller (Program_Exercise,
// Program_MuscleGroup) med kopplingstabeller.
//
// Fördelar med embedding:
//   - Allt om ett program hämtas i ett enda anrop (snabbt)
//   - Inga JOIN-operationer behövs
//
// Nackdelar:
//   - Svårare att uppdatera en övning på ett ställe om samma
//     övning finns i många program
//
// PT lagras som ett inbäddat objekt (pt: {...}).
// Om programmet inte har en PT är pt: null.
// ------------------------------------------------------------
db.programs.insertMany([
  {
    _id: 1,
    name: "Styrka Grund",
    description: "Grundläggande styrkträning för nybörjare",
    price: 799,
    // PT-objektet innehåller id + namn direkt — ingen separat PT-samling behövs
    pt: { pt_id: 1, first_name: "Anna", last_name: "Lindqvist" },
    // exercises är en array av objekt — varje objekt har namn, sets och reps
    exercises: [
      { name: "Bench Press", sets: 4, reps: 8 },
      { name: "Squat",       sets: 4, reps: 8 },
      { name: "Deadlift",    sets: 3, reps: 6 },
      { name: "Pull-up",     sets: 3, reps: 8 },
    ],
    // muscleGroups är en array av strängar — enkelt att filtrera på i queries
    muscleGroups: ["Chest", "Back", "Legs"],
  },
  {
    _id: 2,
    name: "Överkropp Max",
    description: "Intensivt program fokus överkropp",
    price: 999,
    pt: { pt_id: 2, first_name: "Marcus", last_name: "Ek" },
    exercises: [
      { name: "Bench Press",    sets: 5, reps: 6  },
      { name: "Pull-up",        sets: 4, reps: 8  },
      { name: "Shoulder Press", sets: 4, reps: 10 },
      { name: "Bicep Curl",     sets: 3, reps: 12 },
    ],
    muscleGroups: ["Chest", "Back", "Shoulders", "Arms"],
  },
  {
    _id: 3,
    name: "Ben & Rumpa",
    description: "Fokus på nedre kroppen och glutes",
    price: 899,
    pt: { pt_id: 1, first_name: "Anna", last_name: "Lindqvist" },
    exercises: [
      { name: "Squat",     sets: 5, reps: 8  },
      { name: "Leg Press", sets: 4, reps: 12 },
      { name: "Deadlift",  sets: 3, reps: 5  },
    ],
    muscleGroups: ["Legs"],
  },
  {
    _id: 4,
    name: "Kondition Plus",
    description: "Konditionsträning med inslag av styrka",
    price: 699,
    pt: { pt_id: 3, first_name: "Sara", last_name: "Bergström" },
    exercises: [
      { name: "Plank",       sets: 3, reps: 60 }, // reps = sekunder för Plank
      { name: "Squat",       sets: 3, reps: 15 },
      { name: "Bench Press", sets: 3, reps: 15 },
    ],
    muscleGroups: ["Legs", "Core"],
  },
  {
    _id: 5,
    name: "Självträning A",
    description: "Strukturerat program utan PT, helkropp",
    price: 0,   // gratis — ingen PT kopplad
    pt: null,   // null = inget PT-objekt, personen tränar själv
    exercises: [
      { name: "Bench Press", sets: 3, reps: 10 },
      { name: "Squat",       sets: 3, reps: 10 },
      { name: "Pull-up",     sets: 3, reps: 8  },
      { name: "Plank",       sets: 3, reps: 45 }, // reps = sekunder
    ],
    muscleGroups: ["Chest", "Back", "Legs", "Core"],
  },
]);

// ------------------------------------------------------------
// bookings — kopplar person_id till program_id
//
// Här används REFERENS istället för embedding.
// Vi lagrar bara id:n (person_id, program_id), inte hela
// person- eller program-dokumentet. Det är lämpligt eftersom
// en bokning inte behöver all info — bara vem som bokat vad.
//
// Datum lagras som strängar (ISO 8601: "YYYY-MM-DD").
// MongoDB har också en ISODate-typ, men strängar fungerar
// för sortering/filtrering så länge formatet är konsekvent.
// ------------------------------------------------------------
db.bookings.insertMany([
  { person_id: 1, program_id: 1, booking_date: "2025-01-05", start_date: "2025-01-10", end_date: "2025-03-10" }, // Erik: Styrka Grund
  { person_id: 1, program_id: 4, booking_date: "2025-03-15", start_date: "2025-03-20", end_date: "2025-05-20" }, // Erik: Kondition Plus
  { person_id: 2, program_id: 2, booking_date: "2025-01-08", start_date: "2025-01-15", end_date: "2025-03-15" }, // Maja: Överkropp Max
  { person_id: 2, program_id: 3, booking_date: "2025-04-01", start_date: "2025-04-07", end_date: "2025-06-07" }, // Maja: Ben & Rumpa
  { person_id: 3, program_id: 5, booking_date: "2025-02-01", start_date: "2025-02-03", end_date: "2025-04-03" }, // Oscar: Självträning A
  { person_id: 4, program_id: 1, booking_date: "2025-01-20", start_date: "2025-01-25", end_date: "2025-03-25" }, // Lina: Styrka Grund
  { person_id: 4, program_id: 2, booking_date: "2025-04-10", start_date: "2025-04-14", end_date: "2025-06-14" }, // Lina: Överkropp Max
  { person_id: 5, program_id: 3, booking_date: "2025-02-10", start_date: "2025-02-15", end_date: "2025-04-15" }, // Johan: Ben & Rumpa
]);

// Bekräftar att data infogades — skriver ut antal dokument per samling
print("persons:  " + db.persons.countDocuments());
print("programs: " + db.programs.countDocuments());
print("bookings: " + db.bookings.countDocuments());
