const express = require('express')
const listController = require('../../controllter/uni/listController')
const listRouter = express.Router()


listRouter.get('/uni/list', listController.getLoveList)
listRouter.get('/uni/sku', listController.getSku)


module.exports = listRouter