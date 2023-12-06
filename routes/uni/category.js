var express = require('express');
var categoryRouter = express.Router();
const categoryController = require('../../controllter/uni/categoryController')

categoryRouter.get('/uni/category', categoryController.getCategoryList)
categoryRouter.get('/uni/subcate', categoryController.getSubcateList)

module.exports = categoryRouter