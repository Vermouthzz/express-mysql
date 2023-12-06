const cardServices = require('../../services/uni/cardServices')

const cardController = {
  getCardChange: (req, res) => {
    cardServices.getCardChangeList(req, res)
  }
}

module.exports = cardController