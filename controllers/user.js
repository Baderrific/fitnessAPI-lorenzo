const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { errorHandler, createAccessToken } = require("../auth");


// [USER REGISTRATION]
module.exports.userRegistration = (req, res) => {

    if(!req.body || typeof req.body.email !== "string" || typeof req.body.password !== "string") {

        return res.status(400).send({
            message: "Email and password are required"
        });

    } else if(!req.body.email.includes("@")) {

        return res.status(400).send({
            message: "Invalid email address"
        });

    } else if(req.body.password.length < 8) {

        return res.status(400).send({
            message: "Password must contain at least 8 characters"
        });

    } else {

        let newUser = new User({
            email: req.body.email.trim().toLowerCase(),
            password: bcrypt.hashSync(req.body.password, 10)
        });

        return newUser.save()
        .then(result => {

            return res.status(201).send({
                message: "User registered successfully",
                user: {
                    _id: result._id,
                    email: result.email
                }
            });

        })
        .catch(error => {

            return errorHandler(error, req, res);
        });
    }
};


// [USER LOGIN]
module.exports.userAuthentication = (req, res) => {

    if(!req.body || typeof req.body.email !== "string" || typeof req.body.password !== "string") {

        return res.status(400).send({
            message: "Email and password are required"
        });
    }

    let email = req.body.email.trim().toLowerCase();
    let password = req.body.password;

    if(email === "" || password === "") {

        return res.status(400).send({
            message: "Email and password are required"
        });
    }

    return User.findOne({
        email: email
    })
    .then(result => {

        if(!result) {

            return res.status(401).send({
                message: "Invalid email or password"
            });
        }

        let isPasswordCorrect = bcrypt.compareSync(password, result.password);

        if(!isPasswordCorrect) {

            return res.status(401).send({
                message: "Invalid email or password"
            });
        }

        return res.status(200).send({
            message: "User logged in successfully",
            access: createAccessToken(result)
        });

    })
    .catch(error => {

        return errorHandler(error, req, res);
    });
};


// [GET USER DETAILS]
module.exports.retrieveUser = (req, res) => {

    return User.findById(req.user.id)
    .select("-password -__v")
    .then(result => {

        if(!result) {

            return res.status(404).send({
                message: "User not found"
            });
        }

        return res.status(200).send(result);

    })
    .catch(error => {

        return errorHandler(error, req, res);
    });
};