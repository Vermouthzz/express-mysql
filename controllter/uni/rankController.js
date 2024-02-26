const rankServices = require('../../services/uni/rankServices')

const rankController = {
  getRankList: (req, res) => {
    rankServices.getRankListAPI(req, res)
  },
  getSingleRank: (req, res) => {
    rankServices.getSingleRankAPI(req, res)
  }
}


module.exports = rankController