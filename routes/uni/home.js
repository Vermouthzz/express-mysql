var express = require('express');
var homeRouter = express.Router();
const homeController = require('../../controllter/uni/homeController')

homeRouter.post('/uni/home', homeController.getHomeList)

homeRouter.get('/uni/home/nav', homeController.getHomeNav)

module.exports = homeRouter