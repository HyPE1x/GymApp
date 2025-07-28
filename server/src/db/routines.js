const pool = require('../../db.js');

async function getRoutines(user_id) {
    try {
        // Fetch all routines for the user
        const results = await pool.query("SELECT * FROM routines WHERE user_id = $1", [user_id]);
        
        if (results.rows.length > 0) {
            return { status: "success", routines: results.rows };
        } else {
            return { status: "empty", message: "No routines found for this user." };
        }

    } catch (error) {
        console.error("Database Error:", error.message);
        return {status: "error", message: error.message };
    }
}


async function createRoutine(params){
    try {
        const { routine_name, routine_split, user_id } = params;

        // Insert new routine into database
        const newRoutine = await pool.query("INSERT INTO routines (routine_name, routine_split, user_id) VALUES ($1, $2, $3) RETURNING *",[
            routine_name, routine_split, user_id
        ]);

        return {status: "created", routine: newRoutine.rows[0]};

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

module.exports = {
    getRoutines,
    createRoutine,
    deleteRoutine
};