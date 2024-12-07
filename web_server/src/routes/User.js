const express = require('express');
const {
  login,
  register,
  update,
  getUsers,
  adminUpdate,
  search,
} = require('../controller/user');
const { upload } = require('./Film');
const router = express.Router();

router.post('/login', login);
router.get('/getAll', getUsers);
router.get('/search', search);
router.post('/register', register);
router.put('/update/:id', upload.single('avatar'), update);
router.put('/admin/update', adminUpdate);

module.exports = router;
