var express = require('express');
var homeRouter = express.Router();
const homeController = require('../../controllter/uni/homeController')

homeRouter.get('/uni/home',homeController.getHomeList)

module.exports = homeRouter