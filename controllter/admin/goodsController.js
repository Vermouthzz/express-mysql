const goodsService = require('../../services/admin/goodsService')

const goodsController = {
  getGoodsList: (req, res) => {
    goodsService.getGoodsListAPI(req, res)
  }
}

module.exports = goodsController