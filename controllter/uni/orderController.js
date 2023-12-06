const orderServices = require('../../services/uni/orderServices')

const orderController = {
  getOrderItem: (req, res) => {
    orderServices.getOrderItem(req, res)
  },
  delOrderItem: (req, res) => {
    orderServices.getOrderList(req, res)
  },
  createOrder: (req, res) => {
    orderServices.createOrderService(req, res)
  },
  getOrderList: (req, res) => {
    orderServices.getOrderList(req, res)
  },
  updateOrderItem: (req, res) => {
    orderServices.updateOrderItem(req, res)
  }
}

module.exports = orderController