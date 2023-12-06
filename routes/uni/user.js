var express = require('express');
var Userrouter = express.Router();
const userController = require('../../controllter/uni/userController')

/* GET home page. */
Userrouter.post('/uni/avator', userController.updateAvator);
Userrouter.get('/uni/user', userController.getUserInfos);


module.exports = Userrouter;
