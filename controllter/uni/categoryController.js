const categoryServices = require('../../services/uni/categoryServices')

const categoryController = {
  getCategoryList: (req, res) => {
    categoryServices.getCategoryList(req, res)
  },
  getSubcateList: (req, res) => {
    categoryServices.getSecondCate(req, res)
  }
}

module.exports = categoryController