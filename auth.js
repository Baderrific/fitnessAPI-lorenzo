const jwt = require("jsonwebtoken");
require("dotenv").config();


// [CREATE ACCESS TOKEN]
module.exports.createAccessToken = (user) => {

    const data = {
        id: user._id,
        email: user.email
    };

    return jwt.sign(data, process.env.JWT_SECRET_KEY, {
        expiresIn: "1d"
    });
};


// [VERIFY TOKEN]
module.exports.verify = (req, res, next) => {

    let token = req.headers.authorization;

    if(typeof token !== "string" || !token.startsWith("Bearer ")) {

        return res.status(401).send({
            auth: "Failed",
            message: "Valid Bearer token is required"
        });
    }

    token = token.slice(7);

    if(token.trim() === "") {

        return res.status(401).send({
            auth: "Failed",
            message: "No Token Provided"
        });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, decodedToken) {

        if(err || !decodedToken || !decodedToken.id) {

            return res.status(401).send({
                auth: "Failed",
                message: "Invalid or Expired Token"
            });
        }

        req.user = decodedToken;
        next();
    });
};


// [ERROR HANDLER]
module.exports.errorHandler = (err, req, res, next) => {

    console.error(err);

    let statusCode = err.status || err.statusCode || 500;
    let errorMessage = err.message || "Internal Server Error";

    if(err.name === "ValidationError" || err.name === "CastError") {
        statusCode = 400;
    }

    if(err.code === 11000) {
        statusCode = 409;
        errorMessage = "Resource already exists";
    }

    return res.status(statusCode).json({
        error: {
            message: errorMessage,
            errorCode: err.code || "SERVER_ERROR"
        }
    });
};
