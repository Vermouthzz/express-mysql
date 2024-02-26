const cartServices = require('../../services/uni/cartServices')

const cartController = {
  getCart: (req, res) => {
    cartServices.getCartList(req, res)
  },
  addCart: (req, res) => {
    cartServices.addCartList(req, res)
  },
  delCart: (req, res) => {
    cartServices.delCartList(req, res)
  },
  updateCart: (req, res) => {
    cartServices.updateCartItem(req, res)
  },
  getRecommendList: (req, res) => {
    cartServices.getRecommendListAPI(req, res)
  }
}

module.exports = cartController