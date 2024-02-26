const searchServices = require('../../services/uni/searchServices')


const searchController = {
  getSearchResultList: (req, res) => {
    searchServices.getSearchResult(req, res)
  },
  getHotSearchCate: (req, res) => {
    searchServices.getHotSearchCateResult(req, res)
  }
}

module.exports = searchController