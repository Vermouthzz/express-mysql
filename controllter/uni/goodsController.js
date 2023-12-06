const goodsServices = require('../../services/uni/goodsServices')


const goodsController = {
  getGoodsList: (req,res) => {
    goodsServices.getGoodsInfo(req,res)
  },
  // addGoods: (req,res) => {
  //   goodsServices.insertGoods(req,res)
  // },
  getBrandGoods: (req,res) => {
    goodsServices.getBrandGoods(req,res)
  }
}

module.exports = goodsController