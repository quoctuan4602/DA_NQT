// src/models/Actor.js
const mongoose = require("mongoose");

const actorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  birthDate: { type: Date, required: true },
  biography: { type: String, required: true },
  films: [{ type: mongoose.Schema.Types.ObjectId, ref: "Film" }],
  awards: { type: [String], default: [] }, // Array of awards
  image: { type: String, required: true }, // URL or path to actor's image
});

const Actor = mongoose.model("actor", actorSchema);

module.exports = Actor;
