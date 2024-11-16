const Actor = require("../models/Actor");

// Create an actor
const create = async (req, res) => {
  try {
    const actor = new Actor(req.body);
    await actor.save();
    res.status(201).send(actor);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Read all actors
const read = async (req, res) => {
  try {
    const actors = await Actor.find();
    res.send(actors);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Read a single actor by ID
const readByUser = async (req, res) => {
  try {
    const actor = await Actor.findById(req.params.id);
    if (!actor) {
      return res.status(404).send();
    }
    res.send(actor);
  } catch (error) {
    res.status(500).send(error);
  }
};

const update = async (req, res) => {
  try {
    const actor = await Actor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!actor) {
      return res.status(404).send();
    }
    res.send(actor);
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  create,
  read,
  readByUser,
  update,
};
