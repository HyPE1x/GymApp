const pool = require('../../db.js');

async function getRoutines(user_id) {
    try {
        // Fetch all routines for the user
        const results = await pool.query("SELECT * FROM routines WHERE user_id = $1", [user_id]);

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
        const newRoutineResult = await pool.query("INSERT INTO routines (routine_name, routine_split, user_id) VALUES ($1, $2, $3) RETURNING *",[
            routine_name, routine_split, user_id
        ]);
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

module.exports = {
    getRoutines,
    createRoutine,
    deleteRoutine,
    getExercises
};