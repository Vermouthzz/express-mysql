const listServices = require('../../services/uni/listServices')

const listController = {
  getLoveList: (req, res) => {
    listServices.getLoveList(req, res)
  },
  getSku: (req, res) => {
    listServices.getSkuList(req, res)
  },
  getOrderRecommendList: (req, res) => {
    listServices.getOrderRecommendListAPI(req, res)
  }
}

module.exports = listController