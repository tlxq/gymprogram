-- ============================================================
-- Gymprogram — data.sql
-- Testdata för alla tabeller
-- ============================================================

USE gymprogram;

-- ------------------------------------------------------------
-- PT
-- ------------------------------------------------------------
INSERT INTO PT (first_name, last_name, email) VALUES
    ('Anna',    'Lindqvist',  'anna.lindqvist@gym.se'),
    ('Marcus',  'Ek',         'marcus.ek@gym.se'),
    ('Sara',    'Bergström',  'sara.bergstrom@gym.se');

-- ------------------------------------------------------------
-- Person
-- ------------------------------------------------------------
INSERT INTO Person (first_name, last_name, email) VALUES
    ('Erik',    'Svensson',   'erik.svensson@mail.se'),
    ('Maja',    'Johansson',  'maja.johansson@mail.se'),
    ('Oscar',   'Nilsson',    'oscar.nilsson@mail.se'),
    ('Lina',    'Karlsson',   'lina.karlsson@mail.se'),
    ('Johan',   'Persson',    'johan.persson@mail.se');

-- ------------------------------------------------------------
-- Program
-- pt_id NULL = självträningsprogram
-- ------------------------------------------------------------
INSERT INTO Program (name, description, price, pt_id) VALUES
    ('Styrka Grund',    'Grundläggande styrkträning för nybörjare',     799.00, 1),
    ('Överkropp Max',   'Intensivt program fokus överkropp',            999.00, 2),
    ('Ben & Rumpa',     'Fokus på nedre kroppen och glutes',            899.00, 1),
    ('Kondition Plus',  'Konditionsträning med inslag av styrka',       699.00, 3),
    ('Självträning A',  'Strukturerat program utan PT, helkropp',         0.00, NULL);

-- ------------------------------------------------------------
-- Exercise
-- ------------------------------------------------------------
INSERT INTO Exercise (name, description) VALUES
    ('Bench Press',     'Liggande bröstpress med skivstång'),
    ('Squat',           'Knäböj med skivstång'),
    ('Deadlift',        'Marklyft med skivstång'),
    ('Pull-up',         'Chins i stång'),
    ('Shoulder Press',  'Axelpress stående med hantlar'),
    ('Leg Press',       'Benpress i maskin'),
    ('Bicep Curl',      'Bicepscurl med hantlar'),
    ('Plank',           'Statisk core-övning');

-- ------------------------------------------------------------
-- MuscleGroup
-- ------------------------------------------------------------
INSERT INTO MuscleGroup (name) VALUES
    ('Chest'),
    ('Back'),
    ('Legs'),
    ('Shoulders'),
    ('Arms'),
    ('Core');

-- ------------------------------------------------------------
-- Program_Exercise
-- Kopplar övningar till program med sets och reps
-- ------------------------------------------------------------
INSERT INTO Program_Exercise (program_id, exercise_id, sets, reps) VALUES
    -- Styrka Grund (1)
    (1, 1, 4, 8),   -- Bench Press
    (1, 2, 4, 8),   -- Squat
    (1, 3, 3, 6),   -- Deadlift
    (1, 4, 3, 8),   -- Pull-up
    -- Överkropp Max (2)
    (2, 1, 5, 6),   -- Bench Press
    (2, 4, 4, 8),   -- Pull-up
    (2, 5, 4, 10),  -- Shoulder Press
    (2, 7, 3, 12),  -- Bicep Curl
    -- Ben & Rumpa (3)
    (3, 2, 5, 8),   -- Squat
    (3, 6, 4, 12),  -- Leg Press
    (3, 3, 3, 5),   -- Deadlift
    -- Kondition Plus (4)
    (4, 8, 3, 60),  -- Plank (reps = sekunder)
    (4, 2, 3, 15),  -- Squat
    (4, 1, 3, 15),  -- Bench Press
    -- Självträning A (5)
    (5, 1, 3, 10),  -- Bench Press
    (5, 2, 3, 10),  -- Squat
    (5, 4, 3, 8),   -- Pull-up
    (5, 8, 3, 45);  -- Plank

-- ------------------------------------------------------------
-- Program_MuscleGroup
-- ------------------------------------------------------------
INSERT INTO Program_MuscleGroup (program_id, muscle_group_id) VALUES
    -- Styrka Grund: bröst, rygg, ben
    (1, 1), (1, 2), (1, 3),
    -- Överkropp Max: bröst, rygg, axlar, armar
    (2, 1), (2, 2), (2, 4), (2, 5),
    -- Ben & Rumpa: ben
    (3, 3),
    -- Kondition Plus: ben, core
    (4, 3), (4, 6),
    -- Självträning A: bröst, rygg, ben, core
    (5, 1), (5, 2), (5, 3), (5, 6);

-- ------------------------------------------------------------
-- Booking
-- ------------------------------------------------------------
INSERT INTO Booking (person_id, program_id, booking_date, start_date, end_date) VALUES
    (1, 1, '2025-01-05', '2025-01-10', '2025-03-10'),  -- Erik: Styrka Grund
    (1, 4, '2025-03-15', '2025-03-20', '2025-05-20'),  -- Erik: Kondition Plus
    (2, 2, '2025-01-08', '2025-01-15', '2025-03-15'),  -- Maja: Överkropp Max
    (2, 3, '2025-04-01', '2025-04-07', '2025-06-07'),  -- Maja: Ben & Rumpa
    (3, 5, '2025-02-01', '2025-02-03', '2025-04-03'),  -- Oscar: Självträning A
    (4, 1, '2025-01-20', '2025-01-25', '2025-03-25'),  -- Lina: Styrka Grund
    (4, 2, '2025-04-10', '2025-04-14', '2025-06-14'),  -- Lina: Överkropp Max
    (5, 3, '2025-02-10', '2025-02-15', '2025-04-15');  -- Johan: Ben & Rumpa
