// src/routes/commentRoutes.js
const express = require("express");
const router = express.Router();
const actor = require("../controller/Actor");

// CRUD operations for comments
router.post("/", actor.create); // Create
router.get("/", actor.read); // Create
router.get("/user/:id", actor.readByUser); // Read all comments for a film
router.put("/:id", actor.update); // Update

module.exports = router;
