var express = require('express');
var Userrouter = express.Router();
const userController = require('../../controllter/uni/userController')

/* GET home page. */
Userrouter.post('/uni/avator', userController.updateAvator);

Userrouter.get('/uni/user', userController.getUserInfos);

Userrouter.post('/uni/verify', userController.verify)

Userrouter.post('/uni/user/balance', userController.postUserMoney)


module.exports = Userrouter;
