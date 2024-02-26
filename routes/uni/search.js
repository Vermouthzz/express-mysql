var express = require('express');
var searchRouter = express.Router();
const searchController = require('../../controllter/uni/searchController')

searchRouter.get('/uni/search', searchController.getSearchResultList)

searchRouter.get('/uni/hot/cate', searchController.getHotSearchCate)


module.exports = searchRouter