// src/models/Type.js
const mongoose = require("mongoose");

const typeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
});

const Type = mongoose.model("Type", typeSchema);

module.exports = Type;
