const express = require("express")
const router = express.Router();
const {check} = require("express-validator")

const { registerUser, loginUser, getMe } = require("../controllers/AuthController");
const {protect} = require("../middleware/auth")



router.post("/", [check("email", "Emails is required").isEmail(),
check("password", "Password is required").not().isEmpty()]
    , loginUser);

router.post("/Register", [
    check("username", "username is required").not().isEmpty(),
    check("email", "Emails is required").isEmail(),
    check("password", "password is required").not().isEmpty(),
], registerUser);

router.route("/:id").get(protect, getMe)

module.exports= router