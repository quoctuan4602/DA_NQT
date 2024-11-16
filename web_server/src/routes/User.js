const express = require("express");
const { login, register, update } = require("../controller/user");
const { upload } = require("./Film");
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.put("/update/:id", upload.single("avatar"), update);

module.exports = router;
