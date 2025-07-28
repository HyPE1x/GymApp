CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS routines CASCADE;
DROP TABLE IF EXISTS routine_days CASCADE;
DROP TABLE IF EXISTS exercises CASCADE;
DROP TABLE IF EXISTS routine_exercises CASCADE;

CREATE TABLE users(
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name VARCHAR(255) UNIQUE NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL
);

CREATE TABLE routines(
    routine_id SERIAL PRIMARY KEY,
    routine_name VARCHAR(255) NOT NULL,
    routine_split VARCHAR(255) NOT NULL, -- PPL, Arnold, Bro Split, etc.
    user_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE routine_days(
    day_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    routine_id INTEGER REFERENCES routines(routine_id) ON DELETE CASCADE,
    day_name VARCHAR(255) NOT NULL, -- Push, Pull, Legs, Chest/Back, Arms, etc.
    order_number INTEGER NOT NULL -- Order of the day in the routine
);

CREATE TABLE exercises(
    exercise_id SERIAL PRIMARY KEY,
    exercise_name VARCHAR(255) NOT NULL,
    muscle_group VARCHAR(255) NOT NULL, -- Chest, Back, Legs, etc.
    muscle_head VARCHAR(255) -- Optional, specific muscle head like Upper Chest, Lower Back, Side Delt, etc.
);

CREATE TABLE routine_exercises(
    routine_exercise_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    routine_day_id uuid REFERENCES routine_days(day_id) ON DELETE CASCADE,
    exercise_id INTEGER REFERENCES exercises(exercise_id) ON DELETE CASCADE,
    sets INTEGER NOT NULL, -- Number of sets for the exercise
    rep_range_min INTEGER NOT NULL, -- Minimum reps for the exercise
    rep_range_max INTEGER NOT NULL -- Maximum reps for the exercise
);

INSERT INTO exercises (exercise_name, muscle_group, muscle_head) VALUES
--Chest 
('Bench Press', 'Chest', 'Compound'),
('Smith Machine Bench Press', 'Chest', 'Compound'),
('Flat Dumbell Press', 'Chest', 'Compound'),
('Machine Chest Press', 'Chest', 'Compound'),
('Incline Bench Press', 'Chest', 'Upper Chest'),
('Incline Smith Machine Press', 'Chest', 'Upper Chest'),
('Incline Dumbell Press', 'Chest', 'Upper Chest'),
('Incline Machine Press', 'Chest', 'Upper Chest'),
('Decline Bench Press', 'Chest', 'Lower Chest'),
('Decline Smith Machine Press', 'Chest', 'Lower Chest'),
('Decline Dumbell Press', 'Chest', 'Lower Chest'),
('Decline Machine Press', 'Chest', 'Lower Chest'),
('Dips', 'Chest', 'Compound'),
('Push Ups', 'Chest', 'Compound'),
('Dumbell Fly', 'Chest', NULL),
('Pec Dec', 'Chest', NULL)
('Seated Cable Fly', 'Chest', NULL),
('High To Low Cable Fly', 'Chest', 'Lower Chest'),
('Low To High Cable Fly', 'Chest', 'Upper Chest'),
--Shoulders
('Overhead Press', 'Shoulders', 'Front Delt'),
('Smith Machine Overhead Press', 'Shoulders', 'Front Delt'),
('Dumbell Shoulder Press', 'Shoulders', 'Front Delt'),
('Machine Shoulder Press', 'Shoulders', 'Front Delt'),
('Dumbell Lateral Raise', 'Shoulders', 'Side Delt'),
('Machine Lateral Raise', 'Shoulders', 'Side Delt'),
('Cable Lateral Raise', 'Shoulders', 'Side Delt'),
('Rear Delt Fly', 'Shoulders', 'Rear Delt'),
('Face Pulls', 'Shoulders', 'Rear Delt'),
('Reverse Pec Dec', 'Shoulders', 'Rear Delt'),
('Face Pulls', 'Shoulders', 'Rear Delt'),
('Bent Over Reverse Dumbell Fly', 'Shoulders', 'Rear Delt'),
('Reverse Cable Crossovers', 'Shoulders', 'Rear Delt')



