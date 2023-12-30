const db = require('../../config/db.config')
let data = []
const homeServices = {
  getHomeInfo: (req, res) => {
    let { page, pageSize } = req.query
    if (page == 1) {
      let sql = 'select goods_id,retail_price,goods_name,goods_img,goods_price from goods order by rand()'
      db.executeQuery(sql).then(result => {
        data = result
        res.status(200).json({
          msg: 'success',
          leftData: data.slice(0, 5),
          rightData: data.slice(5, 11)
        })
      })
    } else {
      let firstIndex = (page - 1) * pageSize
      let lastIndex = page * pageSize - 1
      let result = data.slice(firstIndex, lastIndex)
      res.status(200).json({
        msg: 'success',
        leftData: result.slice(0, 5),
        rightData: result.slice(5, 10)
      })
    }
  },
  getHomeNav: (req, res) => {
    try {
      let sql = 'select  from goods_category'
    } catch (error) {
      
    }
  }
}

module.exports = homeServices