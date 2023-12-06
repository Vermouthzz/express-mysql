const searchServices = require('../../services/uni/searchServices')


const searchController = {
  getSearchResultList: (req, res) => {
    searchServices.getSearchResult(req, res)
  },
  // getSortSearchResultList: (req, res) => {
  //   searchServices.getSortResult(req, res)
  // }
}

module.exports = searchController