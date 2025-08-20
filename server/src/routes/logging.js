const express = require('express');
const authorization = require("../middleware/authCheck.js");
const loggingController = require("../controllers/logging.js");

const router = express.Router();

//POST new workout session (Required Body: routine_day_id) (user token in header)
router.post('/session/create', authorization, loggingController.createSession);

//Get workout session by session_id
router.get('/session/id/:session_id', loggingController.getSession);

//Get workout sessions by routine_day_id
router.get('/session/day/:routine_day_id', loggingController.getSessionsByDay);

//PUT workout session as inactive (user token in header)
router.put('/session/end/:session_id', authorization, loggingController.endSession);

//POST new set into session (Required Body: session_id, routine_exercise_id, set_number, reps, weight)
router.post('/set/create', loggingController.createSet);

//GET sets by session_id
router.get('/set/session/:session_id', loggingController.getSetsInSession);

//GET sets by exercise_id
router.get('/set/exercise/:exercise_id', loggingController.getSetsbyExercise);

//GET set by set_id
router.get('/set/:set_id', loggingController.getSetByID);



module.exports = router;