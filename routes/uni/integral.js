const integralController = require('../../controllter/uni/integralController')
const express = require('express')
const integralRouter = express.Router()

integralRouter.get('/uni/integral', integralController.getUserIntegral)
integralRouter.post('/uni/integral', integralController.updateUserIntegral)
integralRouter.get('/uni/integral/change', integralController.getIntegralChange)


module.exports = integralRouter