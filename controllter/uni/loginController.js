const loginServices = require('../../services/uni/loginServices')

const loginController = {
  login: (req,res) => {
    loginServices.login(req.body,res)
  },
  register: (req,res) => {
    loginServices.register(req.body,res)
  }
}

module.exports = loginController