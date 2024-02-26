var express = require('express');
var orderRouter = express.Router();
const orderController = require('../../controllter/uni/orderController')

orderRouter.get('/uni/order', orderController.getOrderItem)
orderRouter.put('/uni/order', orderController.createOrder)
orderRouter.delete('/uni/order', orderController.delOrderItem)
orderRouter.post('/uni/order', orderController.updateOrderItem)
orderRouter.get('/uni/orders', orderController.getOrderList)
orderRouter.post('/uni/order/create', orderController.getCreateOrder)

module.exports = orderRouter