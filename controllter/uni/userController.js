const userServices = require('../../services/uni/userServices')

const userController = {
  updateAvator: (req,res) => {
    userServices.updateUserAvator(req,res)
  },
  getUserInfos: (req,res) => {
    userServices.getUserInfo(req,res)
  },
  verify: (req, res) => {
    userServices.verifyPayWord(req, res)
  }
}

module.exports = userController