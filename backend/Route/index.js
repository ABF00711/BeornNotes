const express = require("express");
const userController = require("../Controller/userController.js");
const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

module.exports = router;