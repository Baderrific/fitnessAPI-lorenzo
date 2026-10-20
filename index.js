const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();


// [MIDDLEWARE]
app.use(express.json());
app.use(cors());


// [MONGODB CONNECTION]
mongoose.connect(process.env.MONGODB_STRING)
.then(() => {

    console.log("Connected to MongoDB");

})
.catch(error => {

    console.error("MongoDB connection error:", error.message);
});


// [ROUTES MIDDLEWARE]
const workoutRoutes = require("./routes/workout");
const userRoutes = require("./routes/user");

app.use("/workouts", workoutRoutes);
app.use("/users", userRoutes);


// [ERROR HANDLING MIDDLEWARE]
app.use((error, req, res, next) => {

    if(error instanceof SyntaxError && error.status === 400 && "body" in error) {

        return res.status(400).send({
            message: "Invalid JSON request body"
        });
    }

    return require("./auth").errorHandler(error, req, res, next);
});


// [ROUTE NOT FOUND]
app.use((req, res) => {

    return res.status(404).send({
        message: "Route not found"
    });
});


// [SERVER]
if(require.main === module) {

    app.listen(process.env.PORT || 4000, () => {

        console.log(`API is now online on port ${process.env.PORT || 4000}`);
    });
}

module.exports = {app, mongoose};
