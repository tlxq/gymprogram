# MongoDB — Snabbguide

## Starta

```bash
# Starta containern (första gången)
docker run --name mongodb -p 27017:27017 -d mongo:latest

# Starta om om den stoppats
docker start mongodb

# Öppna mongosh
docker exec -it mongodb mongosh
```

## Ladda in data

Kopiera filerna till containern och kör dem:

```bash
docker cp mongodb/collections.js mongodb:/collections.js
docker cp mongodb/queries.js mongodb:/queries.js
```

Inne i mongosh:

```js
load('/collections.js'); // skapar kollektioner och fyller med data
load('/queries.js'); // kör alla frågor
```

## Vanliga kommandon i mongosh

```js
show dbs                          // visa alla databaser
use gymprogram                    // välj databas
show collections                  // visa kollektioner (= tabeller)

db.programs.find()                // visa alla program
db.programs.find().pretty()       // samma men formaterat
db.persons.find()                 // visa alla personer
db.bookings.find()                // visa alla bokningar

db.programs.countDocuments()      // räkna dokument
db.programs.drop()                // ta bort kollektion
exit                              // avsluta
```

## Ladda om data från scratch

```js
db.programs.drop();
db.persons.drop();
db.bookings.drop();
load('/collections.js');
```

## Frågor

```js
// Alla program, sorterade på pris
db.programs.find({}, { name: 1, price: 1 }).sort({ price: -1 });

// Program som tränar "Legs"
db.programs.find({ muscleGroups: 'Legs' });

// Program dyrare än 800 kr
db.programs.find({ price: { $gt: 800 } });

// Självträningsprogram (ingen PT)
db.programs.find({ pt: null });

// Visa bara namn och pris (projektion)
db.programs.find({}, { name: 1, price: 1, _id: 0 });
```

## Skillnad mot MariaDB

| MariaDB                           | MongoDB                           |
| --------------------------------- | --------------------------------- |
| 8 tabeller + kopplingstabeller    | 3 kollektioner                    |
| JOIN för att hämta övningar       | Övningar inbäddade i dokumentet   |
| Foreign key garanterar integritet | Inget FK-stöd — du ansvarar själv |
| `SELECT * FROM programs`          | `db.programs.find()`              |
| `WHERE price > 800`               | `{ price: { $gt: 800 } }`         |
| `GROUP BY`                        | `$group` i aggregation pipeline   |
