const cardServices = require('../../services/uni/cardServices')

const cardController = {
  getCardChange: (req, res) => {
    cardServices.getCardChangeList(req, res)
  },
  getBalanceChange: (req, res) => {
    cardServices.getBalanceChangeList(req, res)
  },
  updateCardItem: (req, res) => {
    cardServices.updateCardItemAPI(req, res)
  },
  putCardItems: (req, res) => {
    cardServices.putCardItemsAPI(req, res)
  },
  getCardList: (req, res) => {
    cardServices.getCardListAPI(req, res)
  }
}

module.exports = cardController