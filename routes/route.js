const express = require("express");
const router = express.Router();

const { register } = require("../controllers/register");
const { login } = require("../controllers/login");

const { auth, validuser, logout } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);

// protected routes

router.get("/validuser", auth, validuser, (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the Protected route for TESTS",
  });
});

router.get("/logout", auth, logout, (req, resp) => {
  resp.json({
    success: true,
    message: "welcome to the protected routes fro Valid user",
  });
});

module.exports = router;
