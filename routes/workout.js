const express = require("express");
const router = express.Router();

const workoutController = require("../controllers/workout");
const { verify } = require("../auth");


// [ADD WORKOUT]
router.post("/addWorkout", verify, workoutController.addWorkout);


// [GET MY WORKOUTS]
router.get("/myWorkouts", verify, workoutController.getMyWorkouts);


module.exports = router;