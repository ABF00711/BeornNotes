const express = require("express");
const userController = require("../Controller/userController.js");
const searchConfigController = require("../Controller/searchConfigController.js");
const optionDataController = require("../Controller/optionDataController.js");
const router = express.Router();

router.get('/searchConfigData', searchConfigController.getAll);
router.post('/optionData', optionDataController.getAll);

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/isAuth', userController.isAuth);
router.post('/logout', userController.logout);

router.get('/menuItems', )

module.exports = router;