const express = require('express');
const router = express.Router();
const authController = require("../controller/authController");

//Route registrasi user
router.post("/register", authController.register);

//Route login user
router.post("/login", authController.login);

module.exports = router;