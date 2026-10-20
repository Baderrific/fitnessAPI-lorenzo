const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");
const { verify } = require("../auth");


// [USER REGISTRATION]
router.post("/register", userController.userRegistration);


// [USER LOGIN]
router.post("/login", userController.userAuthentication);


// [GET USER DETAILS]
router.get("/details", verify, userController.retrieveUser);


module.exports = router;