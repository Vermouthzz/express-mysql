var express = require('express');
var goodsRouter = express.Router();
const goodsController = require('../../controllter/admin/goodsController')

goodsRouter.get('/admin/goods', goodsController.getGoodsList)

module.exports = goodsRouter