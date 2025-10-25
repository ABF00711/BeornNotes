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
const jobController = require("../Controller/jobController.js");
const documentController = require("../Controller/documentController.js");
const upload = require("../middleware/upload.js");
const router = express.Router();

router.get('/searchConfigData', searchConfigController.getAll);
router.post('/optionData', optionDataController.getAll);

router.post('/auth/register', userController.register);
router.post('/auth/login', userController.login);
router.post('/auth/isAuth', userController.isAuth);
router.post('/auth/logout', userController.logout);
router.post('/auth/updateProfile', authMiddleware, userController.updateProfile);
router.post('/auth/changePassword', authMiddleware, userController.changePassword);
router.get('/auth/qrcode', authMiddleware, userController.getQRCode);
router.post('/auth/enableMFA', authMiddleware, userController.enableMFA);
router.post('/auth/disableMFA', authMiddleware, userController.disableMFA);

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

router.post('/documents/get', authMiddleware, documentController.getDocuments);
router.post('/documents/getOne', authMiddleware, documentController.getUrl);
router.post('/documents/create', authMiddleware, upload.single("file"), documentController.createDocument );
router.post('/documents/update', authMiddleware, upload.single("file"), documentController.updateDocument);
router.post('/documents/delete', authMiddleware, documentController.deleteDocument);

router.get('/job/get', authMiddleware, jobController.getJobs)
module.exports = router;