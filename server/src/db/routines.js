const pool = require('../../db.js');

async function getRoutines(user_id) {
    try {
        // Fetch all routines for the user
        const results = await pool.query("SELECT * FROM routines WHERE user_id = $1 ORDER BY is_active DESC, created_at ASC", [user_id]);

        if (results.rowCount === 0) {
            return { status: "empty", message: "No routines found for this user." };
        }
        routines = results.rows;
        for (const routine of routines) {
            // Fetch days for each routine
            const daysResult = await pool.query("SELECT * FROM routine_days WHERE routine_id = $1 ORDER BY order_number", [routine.routine_id]);
            routine.Days = daysResult.rows;
        }

       return { status: "success", routines: results.rows };

    } catch (error) {
        console.error("Database Error:", error.message);
        return {status: "error", message: error.message };
    }
}


async function createRoutine(params){
    try {
        const { routine_name, routine_split, user_id } = params;

        // Insert new routine into database
        const newRoutineResult = await pool.query(`WITH existing_count AS (SELECT COUNT(*) AS cnt FROM routines WHERE user_id = $3) 
            INSERT INTO routines (routine_name, routine_split, user_id, is_active) 
            VALUES ($1, $2, $3, CASE WHEN (SELECT cnt FROM existing_count) = 0 THEN true ELSE false END) RETURNING *`,
            [routine_name, routine_split, user_id]);
        if (newRoutineResult.rowCount === 0) {
            return { status: "error", message: "Failed to create routine." };
        }
        
        //Create routine days based on split
        const newRoutine = newRoutineResult.rows[0];
        newRoutine.Days = [];
        days = [];
        if(routine_split === 'PPL') {
            days = ['Push', 'Pull', 'Legs'];
        }
        else if (routine_split === 'Arnold Split') {
            days = ['Chest-Back', 'Shoulders-Arms', 'Legs'];
        }
        else if (routine_split === 'Bro Split') {
            days = ['Chest-Shoulders', 'Back', 'Arms', 'Legs'];
        }
        dayNumber = 1;
        for (const day of days) {
            const dayResult = await pool.query("INSERT INTO routine_days (routine_id, day_name, order_number) VALUES ($1, $2, $3)", 
                [newRoutine.routine_id, day, dayNumber]);
            if (dayResult.rowCount > 0) {
                newRoutine.Days.push(dayResult.rows[0]);
            }
            dayNumber++;
        }

        return {status: "created", routine: newRoutine};

    } catch (error) {
        console.error("Database Error:", error.message);
        return {status: "error", message: error.message };
    }
}

async function deleteRoutine(params) {
    try {
        const { routine_id, user_id } = params;
        //check if user is owner of routine
        const checkOwnership = await pool.query("SELECT * FROM routines WHERE routine_id = $1 AND user_id = $2", [routine_id, user_id]);
        if (checkOwnership.rows.length === 0) {
            return { status: "no-perms", message: "You do not have permission to delete this routine." };
        }
        // Delete routine from database
        const deleteResult = await pool.query("DELETE FROM routines WHERE routine_id = $1 RETURNING *", [routine_id]);

        if (deleteResult.rowCount > 0) {
            return { status: "deleted", routine: deleteResult.rows};
        } else {
            return { status: "not-found", message: "Routine not found." };
        }

    } catch (error) {
        console.error("Database Error:", error.message);
        return {status: "error", message: error.message };
        
    }
}

async function setActive(params) {
    try {
        const { routine_id, user_id } = params;

        //check if user is owner of routine
        const checkOwnership = await pool.query("SELECT * FROM routines WHERE routine_id = $1 AND user_id = $2", [routine_id, user_id]);
        if (checkOwnership.rows.length === 0) {
            return { status: "no-perms", message: "You do not have permission to delete this routine." };
        }

        //change user's current active routine to false
        const oldActive = await pool.query("UPDATE routines SET is_active = false WHERE user_id = $1 AND is_active = true RETURNING *", [user_id]);

        //set selected routine as active
        const newActive = await pool.query("UPDATE routines SET is_active = true WHERE routine_id = $1 RETURNING *", [routine_id]);

        return {status: "updated", new: newActive.rows, old: oldActive.rows};

    } catch (error) {
        console.error("Database Error:", error.message);
        return {status: "error", message: error.message };
    }
}

async function getExercises(muscleGroups) {
    try {
        
        if(!muscleGroups || muscleGroups.length === 0) {
            allExercises = await pool.query("SELECT * FROM exercises");
            return { status: "all-exercises", exercises: allExercises.rows };
        }
        else{
            const exercises = await pool.query("SELECT * FROM exercises WHERE muscle_group = ANY($1)", [muscleGroups]);
            if (exercises.rowCount === 0) {
                return { status: "empty", message: "No exercises found for the specified muscle groups." };
            }
            return { status: "filtered-success", exercises: exercises.rows };
        }
    } catch (error) {
        console.error("Database Error:", error.message);
        return {status: "error", message: error.message }; 
    }
}

async function getExerciseByID(exercise_id){
    try {
        const results = await pool.query("SELECT * FROM exercises WHERE exercise_id = $1", 
            [exercise_id]);

        return {status: "found", exercise: results.rows[0]};

    } catch (error) {
        console.error("Database Error:", error.message);
        return {status: "error", message: error.message };
    }
}

async function addExerciseToDay(params){
    try {
        const { routine_id, day_name, exercise_id, sets, rep_range_min, rep_range_max, user_id} = params;

        //GET ID of the Routine Day
        const dayResult = await pool.query("SELECT day_id FROM routine_days WHERE routine_id = $1 AND day_name = $2", 
            [routine_id, day_name]);
        const dayID = dayResult.rows[0]?.day_id;

        //Check if user owns this Routine
        const adminCheck = await pool.query("SELECT r.user_id FROM routine_days rd JOIN routines r ON rd.routine_id = r.routine_id WHERE rd.day_id = $1", 
            [dayID]);
        const idCheck = adminCheck.rows[0]?.user_id;
        if(idCheck !== user_id){
            return {status: "no-perms", message: "This user does not have permission to do this"};
        }

        //Check if exercise is already in routine day
        const dupeCheck = await pool.query("SELECT * FROM routine_exercises WHERE exercise_id = $1 AND routine_day_id = $2", 
            [exercise_id, dayID]);
        if(dupeCheck.rows.length !== 0){
            return {status: "dupe", message: "This exercise already exits on this day"};
        }

        //Add exercise to routine day
        const results = await pool.query("INSERT INTO routine_exercises (routine_day_id, exercise_id, sets, rep_range_min, rep_range_max) VALUES ($1, $2, $3, $4, $5) RETURNING *", 
            [dayID, exercise_id, sets, rep_range_min, rep_range_max]);

        return {status: "added", result: results.rows};
    } catch (error) {
        console.error("Database Error:", error.message);
        return {status: "error", message: error.message };
    }
}

async function deleteExerciseFromDay(params) {
    try {
        const { routine_id, day_name, exercise_id, user_id} = params;

        //get ID of the Routine Day
        const dayResult = await pool.query("SELECT day_id FROM routine_days WHERE routine_id = $1 AND day_name = $2", 
            [routine_id, day_name]);
        const dayID = dayResult.rows[0]?.day_id;

        //Check if user owns this Routine
        const adminCheck = await pool.query("SELECT r.user_id FROM routine_days rd JOIN routines r ON rd.routine_id = r.routine_id WHERE rd.day_id = $1", 
            [dayID]);
        const idCheck = adminCheck.rows[0]?.user_id;
        if(idCheck !== user_id){
            return {status: "no-perms", message: "This user does not have permission to do this"};
        }

        //Remove exercise from routine_exercises
        const deleted = await pool.query("DELETE FROM routine_exercises WHERE routine_day_id = $1 AND exercise_id = $2 RETURNING *", 
            [dayID, exercise_id]);
        return {status: "deleted", result: deleted.rows[0]};

    } catch (error) {
        console.error("Database Error:", error.message);
        return {status: "error", message: error.message };
    }
}

async function getDayExercises(params){
    try {
        const { routine_id, day_name } = params;

        //GET ID of the Routine Day
        const dayResult = await pool.query("SELECT day_id FROM routine_days WHERE routine_id = $1 AND day_name = $2", 
            [routine_id, day_name]);
        const dayID = dayResult.rows[0]?.day_id;

        //Get Routine Day Exercises
        const dayExercises = await pool.query("SELECT * FROM routine_exercises WHERE routine_day_id = $1", 
            [dayID]);

        return {status: "success", exercises: dayExercises.rows};

    } catch (error) {
        console.error("Database Error:", error.message);
        return {status: "error", message: error.message };
    }
}

module.exports = {
    getRoutines,
    createRoutine,
    deleteRoutine,
    setActive,
    getExercises,
    getExerciseByID,
    addExerciseToDay,
    deleteExerciseFromDay,
    getDayExercises
};