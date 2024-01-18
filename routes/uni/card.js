var express = require('express');
var cardRouter = express.Router();
const cardController = require('../../controllter/uni/cardController')

//获取礼品卡、提货卡消费明细
cardRouter.get('/uni/card/detail', cardController.getCardChange)

cardRouter.get('/uni/card/change', cardController.updateCardItem)

cardRouter.get('/uni/card', cardController.getCardList)


module.exports = cardRouter