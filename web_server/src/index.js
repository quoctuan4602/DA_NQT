// src/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

mongoose
  .connect('mongodb+srv://chmtk59leo:chmtk59leo@film.8goy8.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

routes(app);
