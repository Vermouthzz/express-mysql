const loginService = require('../../services/admin/loginService')

const loginController = {
  verifyLogin: (req, res) => {
    loginService.verifyLoginAPI(req, res)
  }
}

module.exports = loginController