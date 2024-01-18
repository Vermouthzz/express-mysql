var express = require('express');
var userRouter = express.Router();
const userController = require('../../controllter/admin/userController')

userRouter.get('/admin/user', userController.getUserInfo)


module.exports = userRouter