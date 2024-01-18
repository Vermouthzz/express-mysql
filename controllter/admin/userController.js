const userService = require('../../services/admin/userService')


const userController = {
  getUserInfo: (req, res) => {
    userService.getUserInfoAPI(req, res)
  }
}

module.exports = userController