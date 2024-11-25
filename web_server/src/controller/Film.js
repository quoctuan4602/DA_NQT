const Film = require('../models/Film');

const create = async (req, res) => {
  const name = req.body['name'];
  const type = req.body['type'];
  const actor = req.body['actor'];
  const director = req.body['director'];
  const year = req.body['year'];
  const description = req.body['description'];
  const image = req.files['image'] ? req.files['image'][0].filename : null;
  const video = req.files['video'] ? req.files['video'][0].filename : null;
  const film = new Film({
    name,
    description,
    image,
    video,
    type,
    year,
    actor,
    director,
  });
  try {
    const savedFilm = await film.save();
    res.status(201).json(savedFilm);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all films
const getAll = async (req, res) => {
  try {
    const films = await Film.find().populate('type');
    res.json(films);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a film by ID
const getById = async (req, res) => {
  try {
    const film = await Film.findById(req.params.id).populate('type');
    if (!film) return res.status(404).json({ message: 'Film not found' });
    res.json(film);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateStart = async (req, res) => {
  try {
    const films = await Film.find();
    films.forEach((film) => {
      if (film.ratePeopleCount == 0) {
        film.star = 0;
      } else {
        console.log(Number(film.rateCount) / Number(film.ratePeopleCount));
        film.star = Number(film.rateCount) / Number(film.ratePeopleCount);
      }
      film.save();
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const update = async (req, res) => {
  const { id } = req.params; // Get the film ID from the URL parameters
  const { name, type, actor, director, year, description } = req.body;

  const getFile = (field) => {
    return req.files && req.files[field] && req.files[field].length > 0
      ? req.files[field][0].filename
      : null;
  };

  const image = getFile('image');
  const video = getFile('video');

  try {
    // Find the film by its ID and update its fields
    const film = await Film.findById(id);
    if (!film) {
      return res.status(404).json({ message: 'Film not found' });
    }

    // Update the film's properties
    film.name = name || film.name;
    film.type = type || film.type;
    film.actor = actor || film.actor;
    film.director = director || film.director;
    film.year = year || film.year;
    film.description = description || film.description;
    if (this.ratePeopleCount === 0) {
      film.ratePeopleCount = 0;
    } else {
      film.ratePeopleCount = this.rateCount / this.ratePeopleCount;
    }
    if (image) film.image = image;
    if (video) film.video = video;

    // Save the updated film
    const updatedFilm = await film.save();
    res.status(200).json(updatedFilm); // Return the updated film
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const film = await Film.findByIdAndDelete(req.params.id);
    if (!film) return res.status(404).json({ message: 'Film not found' });
    res.status(204).json({ message: 'Film deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Search films by name
const search = async (req, res) => {
  const { name } = req.params;

  if (!name) {
    return res
      .status(400)
      .json({ message: 'Name query parameter is required' });
  }

  try {
    const films = await Film.find({ name: { $regex: name, $options: 'i' } });
    res.status(200).json(films);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Search films by type
const getType = async (req, res) => {
  const { type } = req.params;

  if (!type) {
    return res
      .status(400)
      .json({ message: 'Type query parameter is required' });
  }
  try {
    const films = await Film.find({ type: { $regex: type, $options: 'i' } });
    res.status(200).json(films);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addRating = async (req, res) => {
  try {
    const { filmId, rating } = req.body;
    if (rating < 1 || rating > 10) {
      return res
        .status(400)
        .json({ message: 'Rating must be between 1 and 10' });
    }

    const film = await Film.findById(filmId);
    if (!film) {
      return res.status(404).json({ message: 'Film not found' });
    }
    film.rateCount += rating;
    film.ratePeopleCount += 1;
    if (film.ratePeopleCount == 0) {
      film.star = 0;
    } else {
      film.star = Number(film.rateCount) / Number(film.ratePeopleCount);
    }
    await film.save();
    res.status(200).json({
      message: 'Rating added successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while adding the rating',
      error: error.message,
    });
  }
};

const setActor = async (req, res) => {
  const actorId = req.params.actorId;
  try {
    const films = await Film.updateMany({}, { $addToSet: { actors: actorId } });
    res.send({
      message: 'Actor added to all films.',
      filmsUpdated: films.modifiedCount,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

const setType = async (req, res) => {
  const typeId = req.params.typeId;
  try {
    const films = await Film.updateMany({}, { type: typeId });
    res.send({
      message: 'Actor added to all films.',
      filmsUpdated: films.modifiedCount,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

const filter = async (req, res) => {
  const { year, actor, type } = req.query;
  const filter = {};
  if (year) {
    filter.year = year;
  }
  if (actor) {
    filter.actors = actor;
  }
  if (type) {
    filter.type = type;
  }
  try {
    const films = await Film.find(filter).populate('type');
    res.send(films);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getFilmsSortedByDate = async (req, res) => {
  try {
    const films = await Film.find().sort({ createdAt: -1 }).limit(9).exec();
    res.status(200).json(films);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch films', error });
  }
};
const sortByRate = async (req, res) => {
  try {
    const films = await Film.find().sort({ star: -1 }).limit().exec();
    res.status(200).json(films);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch films', error });
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
  search,
  getType,
  addRating,
  setActor,
  filter,
  setType,
  getFilmsSortedByDate,
  sortByRate,
  updateStart,
};
