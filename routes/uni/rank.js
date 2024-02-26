var express = require('express');
var rankRouter = express.Router();
const rankController = require('../../controllter/uni/rankController')

rankRouter.get('/uni/rank', rankController.getRankList)

rankRouter.get('/uni/rank/single', rankController.getSingleRank)

module.exports = rankRouter