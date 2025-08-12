const express = require('express');
const routinesController = require("../controllers/routines.js");
const authorization = require("../middleware/authCheck.js");

const router = express.Router();

//GET all routines for a user (Required Header: user token)
router.get('/', authorization, routinesController.getRoutines);

//POST new routine (Required body: routine_name, routine_split) (user token in header)
router.post('/create', authorization, routinesController.createRoutine);

//DELETE a routine (Required body: routine_id) (user token in header)
router.delete('/delete/:routine_id', authorization, routinesController.deleteRoutine);

//PUT a routine as active routine and deactivate any other active routine (Required body: routine_id) (user token in header)
router.put('/active', authorization, routinesController.setActive);

//GET exercises (add query parameters for filtering if needed ex: /exercises?muscleGroup=Chest,Shoulders,Triceps)
router.get('/exercises', routinesController.getExercises);

//GET exercises by ID
router.get('/exercises/:exercise_id', routinesController.getExerciseByID);

//POST exercise into a routine day (Required body: routine_id, day_name, exercise_id, sets, rep_range_min, rep_range_max) (user token in header)
router.post('/day/add', authorization, routinesController.addExerciseToDay);

//GET routine day (Required body: routine_id, day_name)
router.get('/day/:routine_id/:day_name', routinesController.getRoutineDay);

//PUT the next routine day as the current day (Required body: routine_id) (user token in header)
router.put('/day/current', authorization, routinesController.setCurrentDay);

//DELETE exercise from a routine day (Required body: routine_id, day_name, exercise_id) (user token in header)
router.delete('/day/delete', authorization, routinesController.deleteExerciseFromDay);

//GET routine day exercises
router.get('/:routine_id/:day_name', routinesController.getDayExercises);

module.exports = router;