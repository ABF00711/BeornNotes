const express = require("express");
const userController = require("../Controller/userController.js");
const searchConfigController = require("../Controller/searchConfigController.js");
const optionDataController = require("../Controller/optionDataController.js");
const authMiddleware = require("../middleware/index.js");
const menuController = require("../Controller/menuController.js");
const dynamicDataController = require("../Controller/dynamicDataController.js");
const router = express.Router();

router.get('/searchConfigData', searchConfigController.getAll);
router.post('/optionData', optionDataController.getAll);

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/isAuth', userController.isAuth);
router.post('/logout', userController.logout);

router.get('/menuItems', authMiddleware, menuController.getMenuItems);

router.post('/dynamicData/get', authMiddleware, dynamicDataController.getDynamicData);
router.post('/dynamicData/create', authMiddleware, dynamicDataController.createDynamicData);

module.exports = router;