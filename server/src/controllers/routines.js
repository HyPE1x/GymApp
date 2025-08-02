const routine_db = require('../db/routines.js');

async function getRoutines(req, res) {
    try {
        const user_id = req.user;
        const results = await routine_db.getRoutines(user_id);
        
        if (results.status === "success") {
            res.status(200).json({ routines: results.routines });
        }
        if (results.status === "empty") {
            res.status(404).json({ message: results.message });
        }
        if (results.status === "error") {
            res.status(500).json({ message: "Database error", error: results.message });
        }
    } catch (error) {
        console.error('Error fetching routines:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function createRoutine(req, res) {
    try {
        const user_id = req.user
        const { routine_name, routine_split} = req.body;
        const results = await routine_db.createRoutine({ routine_name, routine_split, user_id });
        if (results.status === "created") {
            res.status(200).json({ message: "Routine created successfully", routine: results.routine });
        }
        if (results.status === "error") {
            res.status(500).json({ message: "Database error", error: results.message });
        }
    } catch (error) {
        console.error('Error creating routine:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function deleteRoutine(req, res) {
    try {
        const user_id = req.user;
        const routine_id = req.params.routine_id; // Assuming routine_id is passed as a URL parameter
        const results = await routine_db.deleteRoutine({ routine_id, user_id });

        if (results.status === "deleted") {
            res.status(200).json({ message: "Routine deleted successfully", routine: results.routine });
        } 
        if (results.status === "not-found") {
            res.status(404).json({ message: results.message });
        } 
        if (results.status === "no-perms") {
            res.status(403).json({ message: results.message });
        }
        if (results.status === "error") {
            res.status(500).json({ message: "Database error", error: results.message });
        }
    } catch (error) {
        console.error('Error deleting routine:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getExercises(req, res) {
    try {
        const { muscleGroups } = req.query;
        
        let results;

        if (!muscleGroups) {
            empty = [];
            results = await routine_db.getExercises(empty);
        }
        else {
            const muscleGroupArray = muscleGroups.split(',').map(group => group.trim());
            results = await routine_db.getExercises(muscleGroupArray);
        }

        if(results.status === "filtered-success") {
            res.status(200).json({ message: "Returning specified exercises", exercises: results.exercises });
        }
        if(results.status === "all-exercises") {
            res.status(200).json({ message: "Returning all exercises", exercises: results.exercises });
        }
        if(results.status === "empty") {
            res.status(404).json({ message: results.message });
        }
        if(results.status === "error") {
            res.status(500).json({ message: "Database error", error: results.message });
        }
    } catch (error) {
        console.error('Error fetching exercises:', error);
        res.status(500).json({ error: 'Internal server error' });
        
    }
}

module.exports = {
    getRoutines,
    createRoutine,
    deleteRoutine,
    getExercises
};