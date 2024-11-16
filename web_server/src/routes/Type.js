// src/routes/commentRoutes.js
const express = require("express");
const router = express.Router();
const type = require("../controller/Type");

// CRUD operations for comments
router.post("/", type.create); // Create
router.get("/", type.read); // Read all comments for a film
router.put("/:id", type.create); // Update

module.exports = router;
