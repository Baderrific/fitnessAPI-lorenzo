const mongoose = require("mongoose");

// [WORKOUT SCHEMA]
const workoutSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Workout name is required"],
        trim: true
    },

    duration: {
        type: Number,
        required: [true, "Duration is required"],
        min: [0.01, "Duration must be greater than zero"]
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        immutable: true
    },

    dateAdded: {
        type: Date,
        default: Date.now,
        immutable: true
    },

    status: {
        type: String,
        enum: ["Pending", "Completed"],
        default: "Pending"
    }
});

workoutSchema.index({ userId: 1, dateAdded: -1 });

module.exports = mongoose.model("Workout", workoutSchema);
