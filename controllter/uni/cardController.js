const cardServices = require('../../services/uni/cardServices')

const cardController = {
  getCardChange: (req, res) => {
    cardServices.getCardChangeList(req, res)
  },
  getBalanceChange: (req, res) => {
    cardServices.getBalanceChangeList(req, res)
  }
}

module.exports = cardController