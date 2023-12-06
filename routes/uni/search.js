var express = require('express');
var searchRouter = express.Router();
const searchController = require('../../controllter/uni/searchController')

searchRouter.get('/uni/search', searchController.getSearchResultList)
// searchRouter.get('/uni/search/:type', searchController.getSortSearchResultList)
// searchRouter.get('/uni/search/query', searchController.getSearchResultList)


module.exports = searchRouter