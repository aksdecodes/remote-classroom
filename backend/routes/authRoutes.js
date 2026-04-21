const express = require("express");
const router = express.Router();

const { register, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Routes
router.post("/register", register);
router.get('/register', (req, res) => {
  res.send("Register route working");
});
router.post("/login", login);
router.get("/me", protect, getMe);

module.exports = router;