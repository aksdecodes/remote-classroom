const express = require("express");
const router = express.Router();
const Content = require("../models/Content");

// GET all content
router.get("/", async (req, res) => {
  try {
    const data = await Content.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;