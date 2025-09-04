const express = require("express");
const userController = require("../Controller/userController");
const router = express.Router();

router.post('/register', userController.login);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

module.exports = router;