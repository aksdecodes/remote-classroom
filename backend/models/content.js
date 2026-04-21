const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  title: String,
  type: String,
  url: String,
  className: String
});

module.exports = mongoose.model("Content", contentSchema);