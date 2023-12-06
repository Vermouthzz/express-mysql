var express = require('express');
var cartRouter = express.Router();
const cartController = require('../../controllter/uni/cartController')

//post为添加购物车
cartRouter.post('/uni/cart', cartController.addCart)
//put为修改购物车
cartRouter.put('/uni/cart', cartController.updateCart)
//删除
cartRouter.delete('/uni/cart', cartController.delCart)
//Delete为请求体参数
//get为获取购物车
cartRouter.get('/uni/cart', cartController.getCart)


module.exports = cartRouter