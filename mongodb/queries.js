// ============================================================
// Gymprogram — queries.js
// Kör i mongosh: load("queries.js")
// ============================================================

// Väljer databasen — måste matcha den som skapades i collections.js
use("gymprogram");

// ------------------------------------------------------------
// MF1: Visa alla program med pris och PT
//
// find({ }, { name: 1, price: 1, pt: 1 })
//   - Första {} = filter: inga villkor = hämta ALLA dokument
//   - Andra {} = projektion: välj vilka fält som ska visas (1 = inkludera)
//     (_id visas alltid om man inte skriver _id: 0)
//
// .sort({ price: -1 })
//   -1 = fallande ordning (högst pris först)
//    1 = stigande ordning
//
// .forEach(p => { ... })
//   Loopar igenom varje resultat-dokument och skriver ut en rad
//   p.pt är null för självträningsprogram — ternary hanterar det
// ------------------------------------------------------------
print("\n-- MF1: Alla program med pris och PT --");
db.programs.find({}, { name: 1, price: 1, pt: 1 }).sort({ price: -1 }).forEach(p => {
  // Kontrollerar om pt-fältet finns (inte null) — visar "Självträning" annars
  const ptNamn = p.pt ? p.pt.first_name + " " + p.pt.last_name : "Självträning";
  print(p.name + "  |  " + p.price + " kr  |  " + ptNamn);
});

// ------------------------------------------------------------
// MF2: Visa alla program som tränar benen
//
// muscleGroups är en array i varje dokument, t.ex. ["Legs", "Core"]
// MongoDB kan söka direkt i arrayer: { muscleGroups: "Legs" }
// hittar alla dokument där "Legs" finns NÅGONSTANS i arrayen.
// I SQL hade detta krävt en JOIN mot Program_MuscleGroup.
//
// printjson(p) skriver ut hela dokumentet som formaterad JSON
// ------------------------------------------------------------
print("\n-- MF2: Program som tränar Legs --");
db.programs.find(
  { muscleGroups: "Legs" },          // filter: muscleGroups-arrayen måste innehålla "Legs"
  { name: 1, price: 1, muscleGroups: 1 } // projektion: visa bara dessa fält
).forEach(p => printjson(p));

// ------------------------------------------------------------
// MF3: Räkna hur många bokningar varje program har
//
// aggregate() kör en pipeline — data flödar igenom steg för steg:
//
// Steg 1: $group
//   - _id: "$program_id"  → gruppera raderna efter program_id
//   - antal: { $sum: 1 }  → räkna en (+1) för varje bokning i gruppen
//   Resultatet är ett dokument per unikt program_id med ett "antal"-fält
//
// Steg 2: $sort
//   - { antal: -1 } → sortera fallande (flest bokningar överst)
//
// Motsvarar SQL:
//   SELECT program_id, COUNT(*) AS antal FROM Booking
//   GROUP BY program_id ORDER BY antal DESC;
// ------------------------------------------------------------
print("\n-- MF3: Antal bokningar per program --");
db.bookings.aggregate([
  { $group: { _id: "$program_id", antal: { $sum: 1 } } }, // gruppera och räkna
  { $sort: { antal: -1 } }                                 // sortera fallande
]).forEach(r => print("program_id " + r._id + "  |  " + r.antal + " bokningar"));
