const express = require('express');
const router = express.Router();

const userController = require('../controller/user.controller.js');
const matchController = require('../controller/match.controller.js');


//get category based matches
router.get('/:category/:offset',  userController.authenticateToken, matchController.getMatches);

module.exports = router;