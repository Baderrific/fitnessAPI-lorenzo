const mongoose = require("mongoose");
const Workout = require("../models/Workout");
const { errorHandler } = require("../auth");


// [ADD WORKOUT]
module.exports.addWorkout = (req, res) => {

    if(!req.body || typeof req.body.name !== "string" || req.body.name.trim() === "") {

        return res.status(400).send({
            message: "Workout name is required"
        });
    }

    if(typeof req.body.duration !== "number" || !Number.isFinite(req.body.duration) || req.body.duration <= 0) {

        return res.status(400).send({
            message: "Duration must be a positive number"
        });
    }

    if(req.body.status !== undefined && !["Pending", "Completed"].includes(req.body.status)) {

        return res.status(400).send({
            message: "Invalid workout status"
        });
    }

    let newWorkout = new Workout({
        name: req.body.name.trim(),
        duration: req.body.duration,
        userId: req.user.id,
        status: req.body.status || "Pending"
    });

    return newWorkout.save()
    .then(result => {

        return res.status(201).send({
            message: "Workout added successfully",
            workout: result
        });

    })
    .catch(error => {

        return errorHandler(error, req, res);
    });
};


// [GET MY WORKOUTS]
module.exports.getMyWorkouts = (req, res) => {

    return Workout.find({
        userId: req.user.id
    })
    .sort({ dateAdded: -1 })
    .then(result => {

        return res.status(200).send(result);

    })
    .catch(error => {

        return errorHandler(error, req, res);
    });
};