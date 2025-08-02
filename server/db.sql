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
    order_number INTEGER NOT NULL, -- Order of the day in the routine
    UNIQUE (routine_id, day_name)
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
('Dumbell Fly', 'Chest', 'Full Chest'),
('Pec Dec', 'Chest', 'Full Chest'),
('Seated Cable Fly', 'Chest', 'Full Chest'),
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
('Reverse Cable Crossovers', 'Shoulders', 'Rear Delt'),
--Triceps
('Rope Pushdown', 'Triceps', 'Medial and Lateral Head'),
('Straight Bar Pushdown', 'Triceps', 'Medial and Lateral Head'),
('Reverse Grip Pushdown', 'Triceps', 'Medial and Lateral Head'),
('Single Arm Cable Pushdown', 'Triceps', 'Medial and Lateral Head'),
('Overhead Cable Extension', 'Triceps', 'Long Head'),
('Skull Crushers', 'Triceps', 'Long Head'),
('Dumbell French Press', 'Triceps', 'Long Head'),
('Dumbell 1 Arm Tricep Extension', 'Triceps', 'Long Head'),
('Close Grip Bench Press', 'Triceps', 'Compound'),
('Tricep Dips', 'Triceps', 'Compound'),
('Tricep Dips Machine', 'Triceps', 'Compound'),
--Back
('Deadlift', 'Back', 'Compound'),
('Wide Grip Pull-Up', 'Back', 'Compound'),
('Neutral Grip Pull-Up', 'Back', 'Lats'),
('Chin-Up', 'Back', 'Biceps and Lats'),
('Wide Grip Lat Pulldown', 'Back', 'Lats and Mid Traps'),
('Close Grip Lat Pulldown', 'Back', 'Lats'),
('Barbell Row', 'Back', 'Compound'),
('1 Arm Dumbell Row', 'Back', 'Lats'),
('T-Bar Row', 'Back', 'Lats and Mid Traps'),
('Chest Supported Row', 'Back', 'Lats and Mid Traps'),
('Close Grip Cable Row', 'Back', 'Lats'),
('Wide Grip Cable Row', 'Back', 'Lats and Mid Traps'),
('Cable Lat Pullover', 'Back', 'Lats'),
('Dumbell Lat Pullover', 'Back', 'Lats'),
--Biceps
('Barbell Curl', 'Biceps', 'Long and Short Head'),
('EZ Bar Curl', 'Biceps', 'Long and Short Head'),
('Standing Dumbell Curl', 'Biceps', 'Long and Short Head'),
('Standard Cable Curl', 'Biceps', 'Long and Short Head'),
('Dumbell Preacher Curl', 'Biceps', 'Short Head'),
('Machine Preacher Curl', 'Biceps', 'Short Head'),
('Incline Dumbell Curl', 'Biceps', 'Long Head'),
('Bayesian Cable Curl', 'Biceps', 'Long Head'),
('Hammer Curl', 'Biceps', 'Brachialis and Brachioradialis'),
('Preacher Hammer Curl', 'Biceps', 'Brachialis and Brachioradialis'),
--Quads
('Barbell Back Squat', 'Quads', 'Compound'),
('Barbell Front Squat', 'Quads', 'Compound'),
('Smith Machine Squat', 'Quads', 'Compound'),
('Goblet Squat', 'Quads', 'Compound'),
('Hack Squat', 'Quads', 'Full Quads'),
('45 Degree Leg Press', 'Quads', 'Full Quads'),
('Horizontal Leg Press', 'Quads', 'Full Quads'),
('Bulgarian Split Squat', 'Quads', 'Full Quads'),
('Leg Extension', 'Quads', 'Full Quads'),
--Glutes
('Walking Lunges', 'Glutes', 'Compound'),
('Back Extension', 'Glutes', 'Compound'),
('Romanian Deadlift', 'Glutes', 'Compound'),
('Good Morning', 'Glutes', 'Compound'),
('Barbell Hip Thrust', 'Glutes', 'Middle Glute'),
('Smith Machine Hip Thrust', 'Glutes', 'Middle Glute'),
('Machine Hip Thrust', 'Glutes', 'Middle Glute'),
('Cable Kickback', 'Glutes', 'Upper Glute'),
('Step Up', 'Glutes', 'Upper Glute'),
('Machine Hip Abduction', 'Glutes', 'Upper Glute'),
('Cable Hip Abduction', 'Glutes', 'Upper Glute'),
('Machine Hip Adduction', 'Glutes', 'Inner Thigh'),
('Cable Hip Adduction', 'Glutes', 'Inner Thigh'),
--Hamstrings (Isolation)
('Lying Leg Curl', 'Hamstrings', NULL),
('Seated Leg Curl', 'Hamstrings', NULL),
--Calves
('Standing Dumbell Calf Raise', 'Calves', NULL),
('Standing Calf Raise Machine', 'Calves', NULL),
('Seated Calf Raise Machine', 'Calves', NULL),
('Leg Press Calf Raise', 'Calves', NULL),
('Smith Machine Calf Raise', 'Calves', NULL);













