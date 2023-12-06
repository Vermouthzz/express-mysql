var express = require('express');
var goodsRouter = express.Router();
const goodsController = require('../../controllter/uni/goodsController')

goodsRouter.get('/uni/goods', goodsController.getGoodsList)
// goodsRouter.get('/uni/addgoods', goodsController.addGoods)
goodsRouter.get('/uni/brand/goods', goodsController.getBrandGoods)

module.exports = goodsRouter