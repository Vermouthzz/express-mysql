const db = require('../../config/db.config')
let data = []
const homeServices = {
  getHomeInfo: (req, res) => {
    let { page, pageSize } = req.query
    if (page == 1) {
      let sql = 'select goods_id,retail_price,goods_name,goods_img,goods_price from goods order by rand()'
      db.executeQuery(sql).then(result => {
        data = result
        res.send(data.slice(0, 10))
      })
    } else {
      let firstIndex = (page - 1) * pageSize
      let lastIndex = page * pageSize - 1
      let result = data.slice(firstIndex, lastIndex)
      res.send(result)
    }
  }
}

module.exports = homeServices