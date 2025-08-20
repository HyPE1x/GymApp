const logging_db = require('../db/logging.js');

async function createSession(req, res) {
    try {
        const routine_day_id = req.body.routine_day_id;
        const user_id = req.user;

        const results = await logging_db.createSession({ routine_day_id, user_id });

        if(results.status === "created"){
            res.status(200).json(results.session);
        }
        if(results.status === "error"){
            res.status(500).json({ message: "Database error", error: results.message });
        }
        
    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getSession(req, res) {
    try {
        const session_id = req.params.session_id;
        const results = await logging_db.getSession(session_id);

        if(results.status === "found"){
            res.status(200).json(results.session);
        }
        if(results.status === "error"){
            res.status(500).json({ message: "Database error", error: results.message });
        }
    } catch (error) {
        console.error('Error getting session:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getSessionsByDay(req, res) {
    try {
        const routine_day_id = req.params.routine_day_id;
        const results = await logging_db.getSessionsByDay(routine_day_id);

        if(results.status === "found"){
            res.status(200).json(results.session);
        }
        if(results.status === "error"){
            res.status(500).json({ message: "Database error", error: results.message });
        }
    } catch (error) {
        console.error('Error getting session:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function endSession(req, res) {
    try {
        const session_id = req.params.session_id;
        const user_id = req.user;
        const results = await logging_db.endSession({ session_id, user_id });

        if(results.status === "ended"){
            res.status(200).json(results.session);
        }
        if(results.status === "no-perms"){
            res.status(401).json(results.message);
        }
        if(results.status === "error"){
            res.status(500).json({ message: "Database error", error: results.message });
        }
    } catch (error) {
        console.error('Error ending session:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function createSet(req, res) {
    try {
        const { session_id, routine_exercise_id, set_number, reps, weight } = req.body;
        const results = await logging_db.createSet({ session_id, routine_exercise_id, set_number, reps, weight });

        if(results.status === "created"){
            res.status(200).json(results.set);
        }
        if(results.status === "error"){
            res.status(500).json({ message: "Database error", error: results.message });
        }

    } catch (error) {
        console.error('Error creating set:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getSetsInSession(req, res) {
    try {
        const session_id = req.params.session_id;
        const results = await logging_db.getSetsInSession(session_id)

        if(results.status === "found"){
            res.status(200).json(results.sets);
        }
        if(results.status === "error"){
            res.status(500).json({ message: "Database error", error: results.message });
        }
    } catch (error) {
        console.error('Error getting sets:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getSetsbyExercise(req, res) {
    try {
        const exercise_id = req.params.exercise_id;
        const results = await logging_db.getSetsInSession(exercise_id)

        if(results.status === "found"){
            res.status(200).json(results.sets);
        }
        if(results.status === "error"){
            res.status(500).json({ message: "Database error", error: results.message });
        }
    } catch (error) {
        console.error('Error getting sets:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getSetByID(req, res) {
    try {
        const set_id = req.params.set_id;
        const results = await logging_db.getSetsInSession(set_id)

        if(results.status === "found"){
            res.status(200).json(results.set);
        }
        if(results.status === "error"){
            res.status(500).json({ message: "Database error", error: results.message });
        }
    } catch (error) {
        console.error('Error getting set:', error);
        res.status(500).json({ error: 'Internal server error' });
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