const express = require("express");
const userController = require("../Controller/userController.js");
const searchConfigController = require("../Controller/searchConfigController.js");
const optionDataController = require("../Controller/optionDataController.js");
const authMiddleware = require("../middleware/index.js");
const menuController = require("../Controller/menuController.js");
const dynamicDataController = require("../Controller/dynamicDataController.js");
const filterController = require("../Controller/filterController.js");
const layoutsController = require("../Controller/layoutsController.js");
const tabInterfaceController = require("../Controller/tabInterfaceController.js");
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
router.post('/dynamicData/update', authMiddleware, dynamicDataController.updateDynamicData);
router.post('/dynamicData/delete', authMiddleware, dynamicDataController.deleteDynamicData);

router.post('/searchpatterns/get', authMiddleware, filterController.getSearchpatterns);
router.post('/searchpatterns/create', authMiddleware, filterController.createSearchpatterns);
router.post('/searchpatterns/update', authMiddleware, filterController.updateSearchpatterns);
router.post('/searchpatterns/delete', authMiddleware, filterController.deleteSearchpatterns);

router.post('/layouts/get', authMiddleware, layoutsController.getLayouts);
router.post('/layouts/create', authMiddleware, layoutsController.createLayouts);
router.post('/layouts/update', authMiddleware, layoutsController.updateLayouts);
router.post('/layouts/delete', authMiddleware, layoutsController.deleteLayouts);

router.get('/tabInterfaces/get', authMiddleware, tabInterfaceController.getTabInterfaces);
router.post('/tabInterfaces/create', authMiddleware, tabInterfaceController.createTabInterface);
router.post('/tabInterfaces/update', authMiddleware, tabInterfaceController.updateTabInterface);
router.post('/tabInterfaces/delete', authMiddleware, tabInterfaceController.deleteTabInterface);
module.exports = router;