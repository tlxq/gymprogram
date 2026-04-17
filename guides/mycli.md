# mycli — Snabbguide

## Starta

```bash
# Starta MariaDB-containern om den stoppats
docker start gymdb

# Anslut med mycli
mycli -u root -pgym123 -h 127.0.0.1 -P 3306 gymprogram
```

> Använd `-h 127.0.0.1` istället för `localhost` — undviker socket-problem med Docker.

## Ladda in schema och data

Kör utanför mycli (i terminalen):

```bash
docker exec -i gymdb mariadb -u root -pgym123 gymprogram < sql/schema.sql
docker exec -i gymdb mariadb -u root -pgym123 gymprogram < sql/data.sql
```

## Börja om från scratch

```bash
docker exec -i gymdb mariadb -u root -pgym123 -e "DROP DATABASE gymprogram; CREATE DATABASE gymprogram;"
docker exec -i gymdb mariadb -u root -pgym123 gymprogram < sql/schema.sql
docker exec -i gymdb mariadb -u root -pgym123 gymprogram < sql/data.sql
```

## Vanliga kommandon inne i mycli

```sql
SHOW TABLES;                    -- visa alla tabeller
DESCRIBE Person;                -- visa kolumner för en tabell
SELECT * FROM Program;          -- visa alla program
SELECT * FROM Booking;          -- visa alla bokningar
EXIT;                           -- avsluta
```

## Köra frågor från fil

```bash
docker exec -i gymdb mariadb -u root -pgym123 gymprogram < sql/queries.sql
```

## Vanliga frågor

```sql
-- Alla program med PT-namn
SELECT p.name, p.price,
  COALESCE(CONCAT(pt.first_name, ' ', pt.last_name), 'Självträning') AS pt
FROM Program p
LEFT JOIN PT pt ON p.pt_id = pt.pt_id
ORDER BY p.price DESC;

-- Övningar per program
SELECT p.name AS program, e.name AS övning, pe.sets, pe.reps
FROM Program p
JOIN Program_Exercise pe ON p.program_id = pe.program_id
JOIN Exercise e ON pe.exercise_id = e.exercise_id
ORDER BY p.name;

-- Antal bokningar per person
SELECT per.first_name, per.last_name, COUNT(*) AS bokningar
FROM Person per
JOIN Booking b ON per.person_id = b.person_id
GROUP BY per.person_id;
```

## Kortkommandon i mycli

| Tangent | Funktion |
|---|---|
| `↑` / `↓` | Bläddra i historik |
| `Tab` | Autokomplettera tabellnamn/kolumner |
| `Ctrl+C` | Avbryt pågående fråga |
| `Ctrl+D` | Avsluta |
| `\e` | Öppna frågan i din editor |
