const express = require('express');
const routinesController = require("../controllers/routines.js");
const authorization = require("../middleware/authCheck.js");

const router = express.Router();

//GET all routines for a user (Required body: user token)
router.get('/', authorization, routinesController.getRoutines);

//Post new routine (Required body: routine_name, routine_split, user token,)
router.post('/create', authorization, routinesController.createRoutine);

//DELETE a routine (Required body: routine_id, user token)
router.delete('/delete/:routine_id', authorization, routinesController.deleteRoutine);

//GET exercises (add query parameters for filtering if needed ex: /exercises?muscleGroup=chest,shoulders,triceps)
router.get('/exercises', routinesController.getExercises);


module.exports = router;