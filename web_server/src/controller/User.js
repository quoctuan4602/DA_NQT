const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    const checkpass = await bcrypt.compare(password, user.password);
    if (!user) {
      return res.status(400).json({ message: 'username or passord invalid' });
    }
    if (!checkpass)
      return res.status(400).json({ message: 'username or passord invalid' });
    const token = jwt.sign(
      {
        username,
        password,
      },
      '123',
    );

    return res.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'login err',
    });
  }
};

const register = async (req, res) => {
  const { username, password, fullName } = req.body;

  try {
    const oldUser = await User.findOne({ username });
    if (oldUser)
      return res.status(400).json({
        message: 'Uer have already exit',
      });

    const hashpassWord = await bcrypt.hash(password, 10);
    const newUer = new User({
      username,
      password: hashpassWord,
      fullName,
    });
    const token = jwt.sign(
      {
        username,
        password,
      },
      '123',
    );

    await newUer.save();

    return res.json({
      user: newUer,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'register err',
    });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email } = req.body;

    // Build the update object dynamically
    const updateData = { fullName, email };
    if (req.file) {
      updateData['avatar'] = req.file.filename;
    }
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while updating the user' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while retrieving users' });
  }
};

const adminUpdate = async (req, res) => {
  try {
    const { id, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        role,
      },
      {
        new: true,
      },
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: 'An error occurred while updating the user' });
  }
};

const search = async (req, res) => {
  try {
    const { searchTerm } = req.query;
    const users = await User.find({
      $or: [{ fullName: { $regex: searchTerm, $options: 'i' } }],
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while searching users' });
  }
};

module.exports = {
  login,
  register,
  update,
  getUsers,
  adminUpdate,
  search,
};
