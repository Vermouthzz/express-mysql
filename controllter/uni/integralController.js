const integralServices = require('../../services/uni/integralServices')

const integralController = {
  getUserIntegral: (req ,res) => {
    integralServices.getUserIntegralListAPI(req, res)
  },
  updateUserIntegral: (req, res) => {
    integralServices.updateUserIntegralAPI(req, res)
  },
  getIntegralChange: (req, res) => {
    integralServices.getIntegralChangeAPI(req, res)
  }
}

module.exports = integralController