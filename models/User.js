const mongoose = require("mongoose");

// [USER SCHEMA]
const userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: [true, "Password is required"]
    }
});

module.exports = mongoose.model("User", userSchema);
