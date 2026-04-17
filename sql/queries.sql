-- ============================================================
-- Gymprogram — queries.sql
-- SELECT-frågor mot databasen
-- ============================================================

USE gymprogram;

-- F1: Alla program med PT-namn
-- LEFT JOIN används för att även visa program utan PT (självträning)
SELECT
    p.name AS program,
    p.price,
    pt.first_name AS pt_fornamn,
    pt.last_name  AS pt_efternamn
FROM Program p
LEFT JOIN PT pt ON p.pt_id = pt.pt_id
ORDER BY p.price DESC;

-- F2: Alla bokningar med person- och programnamn
-- INNER JOIN används eftersom en bokning alltid måste ha en person och ett program
SELECT
    b.booking_id,
    per.first_name,
    per.last_name,
    prog.name AS program,
    b.start_date,
    b.end_date
FROM Booking b
INNER JOIN Person  per  ON b.person_id  = per.person_id
INNER JOIN Program prog ON b.program_id = prog.program_id
ORDER BY b.start_date;

-- F3: Antal bokningar per program
-- LEFT JOIN gör att program med 0 bokningar också visas (COUNT blir då 0)
SELECT
    p.name AS program,
    COUNT(b.booking_id) AS antal_bokningar
FROM Program p
LEFT JOIN Booking b ON p.program_id = b.program_id
GROUP BY p.program_id, p.name
ORDER BY antal_bokningar DESC;

-- F4: Visa personer som har mer än en bokning
-- HAVING filtrerar efter GROUP BY — WHERE kan inte användas på aggregerade värden
SELECT
    per.first_name,
    per.last_name,
    COUNT(b.booking_id) AS antal_bokningar
FROM Person per
INNER JOIN Booking b ON per.person_id = b.person_id
GROUP BY per.person_id, per.first_name, per.last_name
HAVING COUNT(b.booking_id) > 1;


-- F5: Kategorisera program med CASE WHEN
-- CASE WHEN fungerar som if/else direkt i SQL — varje program
-- får en prisetikett baserat på sitt pris
SELECT
    name,
    price,
    CASE
        WHEN price = 0   THEN 'Gratis'
        WHEN price < 800 THEN 'Budget'
        ELSE                  'Premium'
    END AS prisniva
FROM Program
ORDER BY price DESC;
