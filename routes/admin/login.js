var express = require('express');
var loginRouter = express.Router();
const loginController = require('../../controllter/admin/loginController')

loginRouter.post('/admin/login', loginController.verifyLogin)

module.exports = loginRouter