var express = require('express');
var Loginrouter = express.Router();
const loginController = require('../../controllter/uni/loginController')

/* GET home page. */
Loginrouter.post('/uni/login', loginController.login);
Loginrouter.get('/uni/register', loginController.register);

module.exports = Loginrouter;
