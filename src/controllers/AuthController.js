const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const { validationResult } = require("express-validator");

const User = require("../models/user");
const asyncHandler = require("../utils/asyncHandler")

// @desc   register a user
// @route  POST /api/vi/users/register
// @access   public
exports.registerUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }
    const { username, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }
    user = await User.create({
        username,
        email,
        password,
    });

    const payload = {
        user: {
            id: user.id,
        },
    };

    jwt.sign(
        payload,
        process.env.JWT_SECRETE,
        {
            expiresIn: process.env.JWT_EXPIRE,
        },
        (err, token) => {
            if (err) throw err;
            res.json({ token });
        }
    );
});

// @desc   login a user
// @route  POST /api/vi/auth
// @access   public
exports.loginUser = asyncHandler( async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  }
    const { email, password } = req.body;
    let user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Invalid user credentials" }] });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Invalid user credentials" }] });
    }
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRETE,
      {
        expiresIn: process.env.JWT_EXPIRE,
      },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
});

// @desc     Get Current logged in user
// @route    Get/api/vi/auth/me
// @access   private
exports.getMe =asyncHandler( async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json(user);
});
