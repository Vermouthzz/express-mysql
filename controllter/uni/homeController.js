const homeServices = require('../../services/uni/homeServices')

const homeController = {
  getHomeList: (req, res) => {
    homeServices.getHomeInfo(req, res)
  },
  getHomeNav: (req, res) => {
    homeServices.getHomeNavAPI(req, res)
  }
}

module.exports = homeController