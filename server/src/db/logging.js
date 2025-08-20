const pool = require('../../db.js');

async function createSession(params) {
    try {
        const {routine_day_id, user_id} = params;

        const newSession = await pool.query(`INSERT INTO workout_session (routine_day_id, user_id, is_active) VALUES ($1, $2, true) RETURNING *`, [routine_day_id, user_id]);

        return {status: "created", session: newSession.rows[0]};

    } catch (error) {
        console.error("Database Error:", error.message);
        return {status: "error", message: error.message };
    }
    

}

async function getSession(param) {
    try {
        const session_id = param;
        
        const session = await pool.query("SELECT * FROM workout_session WHERE session_id = $1", [session_id])

        return {status: "found", session: session.rows[0]};

    } catch (error) {
        console.error("Database Error:", error.message);
        return {status: "error", message: error.message };
    }
}

async function getSessionsByDay(param) {
    try {
        const routine_day_id = param;
        
        const sessions = await pool.query("SELECT * FROM workout_session WHERE routine_day_id = $1", [routine_day_id])

        return {status: "found", session: sessions.rows};

    } catch (error) {
        console.error("Database Error:", error.message);
        return {status: "error", message: error.message };
    }
}

async function endSession(params) {
    try {
        const { session_id, user_id } = params;

        const checkOwnership = await pool.query("SELECT * FROM workout_session WHERE session_id = $1 AND user_id = $2", [session_id, user_id]);
        if (checkOwnership.rows.length === 0) {
            return { status: "no-perms", message: "You are not authorized for this action." };
        }

        const end = await pool.query("UPDATE workout_session SET is_active = false WHERE session_id = $1 AND is_active = true RETURNING *", [session_id])
        return { status: "ended", session: end.rows};

    } catch (error) {
        console.error("Database Error:", error.message);
        return {status: "error", message: error.message };
    }
}

async function createSet(params) {
    try {
        const { session_id, routine_exercise_id, set_number, reps, weight } = params;

        const exerciseID = await pool.query("SELECT exercise_id FROM routine_exercises WHERE routine_exercise_id = $1", [routine_exercise_id])
        const exercise_id = exerciseID.rows[0].exercise_id;


        const newSet = await pool.query("INSERT INTO workout_sets (session_id, routine_exercise_id, exercise_id, set_number, reps, weight) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", 
            [session_id, routine_exercise_id, exercise_id, set_number, reps, weight]);
        
        return {status: "created", set: newSet.rows[0]};

    } catch (error) {
        console.error("Database Error:", error.message);
        return {status: "error", message: error.message };
    }
}

async function getSetsInSession(param) {
    try {
        const session_id = param;

        const sets = await pool.query("SELECT * FROM workout_sets WHERE session_id = $1", [session_id]);

        return {status: "found", sets: sets.rows};
    } catch (error) {
        console.error("Database Error:", error.message);
        return {status: "error", message: error.message };
    }
}

async function getSetsbyExercise(param) {
    try {
        const exercise_id = param;

        const sets = await pool.query("SELECT * FROM workout_sets WHERE exercise_id = $1", [exercise_id]);

        return {status: "found", sets: sets.rows};
    } catch (error) {
        console.error("Database Error:", error.message);
        return {status: "error", message: error.message };
    }
}

async function getSetByID(param) {
    try {
        const set_id = param;

        const set = await pool.query("SELECT * FROM workout_sets WHERE set_id = $1", [set_id]);

        return {status: "found", set: set.rows[0]};
    } catch (error) {
        console.error("Database Error:", error.message);
        return {status: "error", message: error.message };
    }
}

module.exports = {
    createSession,
    getSession,
    getSessionsByDay,
    endSession,
    createSet,
    getSetsInSession,
    getSetsbyExercise,
    getSetByID
};