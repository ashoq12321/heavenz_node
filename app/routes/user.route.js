const express = require('express');
//const { route } = require('express/lib/application');
const router = express.Router();

const userController = require('../controller/user.controller.js');

//user register
router.post('/register', userController.registerUser);

//user login
router.post('/login', userController.login );

//refresh access token
router.post('/token', userController.token);

//user logout
router.post('/logout', userController.authenticateToken, userController.logout );

//update user
router.put('/update', userController.authenticateToken, userController.updateUser);

//fetch current user details
router.get('/get', userController.authenticateToken, userController.getUserDetails);

//fetch current user basic details
router.get('/', userController.authenticateToken, userController.getUserBasicDetails);

//view user by id
router.get('/:user_id', userController.getUserById);

//like user
router.post('/like', userController.authenticateToken, userController.likeUser);

//dislike user
router.post('/dislike', userController.authenticateToken, userController.dislikeUser);




module.exports = router;