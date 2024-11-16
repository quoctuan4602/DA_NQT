// src/routes/typeRoutes.js
const Type = require("../models/Type");

// Create a type
const create = async (req, res) => {
  console.log(req.body);
  try {
    const type = new Type(req.body);
    await type.save();
    res.status(201).send(type);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Read all types
const read = async (req, res) => {
  try {
    const types = await Type.find();
    res.send(types);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Update a type by ID
const update = async (req, res) => {
  try {
    const type = await Type.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!type) {
      return res.status(404).send();
    }
    res.send(type);
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  create,
  read,
  update,
};
