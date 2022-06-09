const express = require('express');
//const { route } = require('express/lib/application');
const router = express.Router();

const userController = require('../controller/user.controller.js');
const imageController = require('../controller/image.controller.js');

//save images
router.post('/save', [userController.authenticateToken, imageController.uploadImages.array('file')], imageController.saveUserImages);

//fetch images
router.get('/get', userController.authenticateToken, imageController.getUserImages);

//fetch images by user id
router.get('/:user_id', imageController.getUserImagesById);


module.exports = router;