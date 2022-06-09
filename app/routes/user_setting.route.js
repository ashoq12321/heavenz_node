const express = require('express');
//const { route } = require('express/lib/application');
const router = express.Router();

const userController = require('../controller/user.controller.js');
const userSettingController = require('../controller/user_setting.controller.js');

//update user settings
router.put('/update', userController.authenticateToken, userSettingController.updateUserSetting);

//fetch user settings
router.get('/get', userController.authenticateToken, userSettingController.getUserSettings);


module.exports = router;