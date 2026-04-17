-- Skapar databasen om den inte redan finns.
-- utf8mb4 stöder svenska tecken (å, ä, ö) och emoji.
-- swedish_ci = case-insensitive sortering enligt svenska regler.
CREATE DATABASE IF NOT EXISTS gymprogram
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_swedish_ci;

-- Väljer databasen så att alla efterföljande tabeller skapas här
USE gymprogram;

-- ------------------------------------------------------------
-- PT (Personal Trainer)
-- Skapas FÖRE Program eftersom Program har en FK till PT.
-- Om man skapar Program först vet inte databasen vad FK pekar på.
-- ------------------------------------------------------------
CREATE TABLE PT (
    pt_id       INT             NOT NULL AUTO_INCREMENT, -- unik nyckel, räknas upp automatiskt
    first_name  VARCHAR(50)     NOT NULL,                -- förnamn, max 50 tecken, krävs
    last_name   VARCHAR(50)     NOT NULL,                -- efternamn, max 50 tecken, krävs
    email       VARCHAR(100)    NOT NULL UNIQUE,         -- UNIQUE = två PT:s kan inte ha samma e-post
    PRIMARY KEY (pt_id)                                  -- pt_id är primärnyckel
);

-- ------------------------------------------------------------
-- Person
-- Den som tränar och gör bokningar.
-- Skapas före Booking eftersom Booking refererar till Person.
-- ------------------------------------------------------------
CREATE TABLE Person (
    person_id   INT             NOT NULL AUTO_INCREMENT, -- unik nyckel per person
    first_name  VARCHAR(50)     NOT NULL,
    last_name   VARCHAR(50)     NOT NULL,
    email       VARCHAR(100)    NOT NULL UNIQUE,         -- ingen kan registrera samma e-post två gånger
    PRIMARY KEY (person_id)
);

-- ------------------------------------------------------------
-- Program
-- En träningsplan. pt_id är NULL om självträning.
-- price uppfyller kravet på numeriskt attribut.
-- ------------------------------------------------------------
CREATE TABLE Program (
    program_id  INT             NOT NULL AUTO_INCREMENT,
    name        VARCHAR(100)    NOT NULL,
    description TEXT,                       -- TEXT för längre fritext, NULL tillåts (inte obligatorisk)
    price       DECIMAL(8,2)    NOT NULL DEFAULT 0.00, -- DECIMAL för exakt decimalberäkning (inte FLOAT)
    pt_id       INT             NULL,       -- NULL = inget PT, dvs självträning
    PRIMARY KEY (program_id),
    -- FK till PT: om en PT tas bort sätts pt_id till NULL istället för att radera programmet
    FOREIGN KEY (pt_id) REFERENCES PT(pt_id)
        ON DELETE SET NULL
);

-- ------------------------------------------------------------
-- Exercise (Övning)
-- Enskild rörelse, t.ex. bänkpress.
-- Separerad från Program för att uppfylla 3NF:
-- övningsnamn/beskrivning beror bara på övningen, inte programmet.
-- ------------------------------------------------------------
CREATE TABLE Exercise (
    exercise_id INT             NOT NULL AUTO_INCREMENT,
    name        VARCHAR(100)    NOT NULL,
    description TEXT,           -- valfri beskrivning av hur övningen utförs
    PRIMARY KEY (exercise_id)
);

-- ------------------------------------------------------------
-- MuscleGroup (Muskelgrupp)
-- T.ex. bröst, rygg, ben.
-- UNIQUE på name förhindrar dubbletter som "Legs" och "Legs".
-- ------------------------------------------------------------
CREATE TABLE MuscleGroup (
    muscle_group_id INT          NOT NULL AUTO_INCREMENT,
    name            VARCHAR(50)  NOT NULL UNIQUE, -- varje muskelgrupp lagras bara en gång
    PRIMARY KEY (muscle_group_id)
);

-- ------------------------------------------------------------
-- Booking (Bokning)
-- Kopplar Person till Program.
-- booking_date, start_date, end_date uppfyller datumkravet.
-- ------------------------------------------------------------
CREATE TABLE Booking (
    booking_id      INT         NOT NULL AUTO_INCREMENT,
    person_id       INT         NOT NULL,   -- FK, NULL inte tillåtet — en bokning MÅSTE ha en person
    program_id      INT         NOT NULL,   -- FK, NULL inte tillåtet — en bokning MÅSTE ha ett program
    booking_date    DATE        NOT NULL,   -- dag bokningsraden skapades
    start_date      DATE        NOT NULL,   -- dag programmet startar
    end_date        DATE        NOT NULL,   -- dag programmet slutar
    PRIMARY KEY (booking_id),
    -- ON DELETE CASCADE: om personen raderas tas deras bokningar med automatiskt
    FOREIGN KEY (person_id)  REFERENCES Person(person_id)   ON DELETE CASCADE,
    -- ON DELETE CASCADE: om programmet raderas tas bokningarna med automatiskt
    FOREIGN KEY (program_id) REFERENCES Program(program_id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Program_Exercise (kopplingstabell M:N)
-- Löser M:N-sambandet mellan Program och Exercise.
-- Vilka övningar ingår i ett program, med sets och reps.
--
-- Sammansatt PK (program_id + exercise_id) garanterar att
-- samma övning inte läggs in två gånger i samma program.
-- ------------------------------------------------------------
CREATE TABLE Program_Exercise (
    program_id      INT     NOT NULL,
    exercise_id     INT     NOT NULL,
    sets            INT     NOT NULL DEFAULT 3,  -- antal set, standard 3 om inget anges
    reps            INT     NOT NULL DEFAULT 10, -- antal reps, standard 10 om inget anges
    PRIMARY KEY (program_id, exercise_id),       -- sammansatt primärnyckel
    FOREIGN KEY (program_id)  REFERENCES Program(program_id)   ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES Exercise(exercise_id) ON DELETE CASCADE
);

-- ------------------------------------------------------------
-- Program_MuscleGroup (kopplingstabell M:N)
-- Löser M:N-sambandet mellan Program och MuscleGroup.
-- Vilka muskelgrupper ett program fokuserar på.
--
-- Sammansatt PK förhindrar att samma muskelgrupp läggs
-- in flera gånger för samma program.
-- ------------------------------------------------------------
CREATE TABLE Program_MuscleGroup (
    program_id      INT     NOT NULL,
    muscle_group_id INT     NOT NULL,
    PRIMARY KEY (program_id, muscle_group_id),   -- sammansatt primärnyckel
    FOREIGN KEY (program_id)      REFERENCES Program(program_id)             ON DELETE CASCADE,
    FOREIGN KEY (muscle_group_id) REFERENCES MuscleGroup(muscle_group_id)    ON DELETE CASCADE
);
