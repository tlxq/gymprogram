// ============================================================
// Gymprogram — queries_mongodb.js
// MongoDB Aggregation Pipeline — jämför med queries.sql
// ============================================================
//
// Antagna collections:
//   programs  { program_id, name, price, pt_id }
//   pts       { pt_id, first_name, last_name }
//   bookings  { booking_id, person_id, program_id, start_date, end_date }
//   persons   { person_id, first_name, last_name }
//
// SQL använder JOIN mellan tabeller.
// MongoDB använder $lookup (referens-modell) eller inbäddade dokument.
// Här används referens-modell för att matcha SQL-strukturen rättvist.
// ============================================================

// ------------------------------------------------------------
// F1: Alla program med PT-namn
// ------------------------------------------------------------
// SQL:
//   SELECT
//       p.name AS program,
//       p.price,
//       pt.first_name AS pt_fornamn,
//       pt.last_name  AS pt_efternamn
//   FROM Program p
//   LEFT JOIN PT pt ON p.pt_id = pt.pt_id
//   ORDER BY p.price DESC;
//
// MongoDB: PT är inbäddad i programs-dokumentet — ingen $lookup behövs.
// Det är själva fördelen med dokument-modellen vs relationsdatabas.
db.programs.aggregate([
  {
    $project: {
      _id: 0,
      program:      "$name",
      price:        1,
      pt_fornamn:   "$pt.first_name",
      pt_efternamn: "$pt.last_name"
    }
  },
  { $sort: { price: -1 } }
]);

// ------------------------------------------------------------
// F2: Alla bokningar med person- och programnamn
// ------------------------------------------------------------
// SQL:
//   SELECT
//       b.booking_id,
//       per.first_name,
//       per.last_name,
//       prog.name AS program,
//       b.start_date,
//       b.end_date
//   FROM Booking b
//   INNER JOIN Person  per  ON b.person_id  = per.person_id
//   INNER JOIN Program prog ON b.program_id = prog.program_id
//   ORDER BY b.start_date;
//
// MongoDB: $lookup utan preserveNullAndEmptyArrays = INNER JOIN
// OBS: foreignField: "_id" eftersom persons/programs använder _id som nyckel
db.bookings.aggregate([
  {
    $lookup: {
      from: "persons",
      localField: "person_id",
      foreignField: "_id",
      as: "person"
    }
  },
  { $unwind: "$person" },
  {
    $lookup: {
      from: "programs",
      localField: "program_id",
      foreignField: "_id",
      as: "program"
    }
  },
  { $unwind: "$program" },
  {
    $project: {
      _id: 0,
      booking_id: "$_id",
      first_name: "$person.first_name",
      last_name:  "$person.last_name",
      program:    "$program.name",
      start_date: 1,
      end_date:   1
    }
  },
  { $sort: { start_date: 1 } }
]);

// ------------------------------------------------------------
// F3: Antal bokningar per program
// ------------------------------------------------------------
// SQL:
//   SELECT
//       p.name AS program,
//       COUNT(b.booking_id) AS antal_bokningar
//   FROM Program p
//   LEFT JOIN Booking b ON p.program_id = b.program_id
//   GROUP BY p.program_id, p.name
//   ORDER BY antal_bokningar DESC;
//
// MongoDB: $lookup ger en array — $size räknar direkt, ingen $group behövs
db.programs.aggregate([
  {
    $lookup: {
      from: "bookings",
      localField: "program_id",
      foreignField: "program_id",
      as: "bookings"
    }
  },
  {
    $project: {
      _id: 0,
      program:         "$name",
      antal_bokningar: { $size: "$bookings" }
    }
  },
  { $sort: { antal_bokningar: -1 } }
]);

// ------------------------------------------------------------
// F4: Visa personer som har mer än en bokning
// ------------------------------------------------------------
// SQL:
//   SELECT
//       per.first_name,
//       per.last_name,
//       COUNT(b.booking_id) AS antal_bokningar
//   FROM Person per
//   INNER JOIN Booking b ON per.person_id = b.person_id
//   GROUP BY per.person_id, per.first_name, per.last_name
//   HAVING COUNT(b.booking_id) > 1;
//
// MongoDB: $group räknar, $match filtrerar (= HAVING), $lookup hämtar namn
db.bookings.aggregate([
  {
    $group: {
      _id:             "$person_id",
      antal_bokningar: { $sum: 1 }
    }
  },
  { $match: { antal_bokningar: { $gt: 1 } } },
  {
    $lookup: {
      from: "persons",
      localField: "_id",
      foreignField: "_id",
      as: "person"
    }
  },
  { $unwind: "$person" },
  {
    $project: {
      _id: 0,
      first_name:      "$person.first_name",
      last_name:       "$person.last_name",
      antal_bokningar: 1
    }
  }
]);

// ------------------------------------------------------------
// F5: Kategorisera program med prisnivå
// ------------------------------------------------------------
// SQL:
//   SELECT
//       name,
//       price,
//       CASE
//           WHEN price = 0   THEN 'Gratis'
//           WHEN price < 800 THEN 'Budget'
//           ELSE                  'Premium'
//       END AS prisniva
//   FROM Program
//   ORDER BY price DESC;
//
// MongoDB: $switch är direkt ekvivalent till CASE WHEN / ELSE
db.programs.aggregate([
  {
    $project: {
      _id: 0,
      name:  1,
      price: 1,
      prisniva: {
        $switch: {
          branches: [
            { case: { $eq: ["$price", 0]   }, then: "Gratis" },
            { case: { $lt: ["$price", 800] }, then: "Budget" }
          ],
          default: "Premium"
        }
      }
    }
  },
  { $sort: { price: -1 } }
]);
