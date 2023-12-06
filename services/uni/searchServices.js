const db = require('../../config/db.config')


const searchServices = {
  getSearchResult: (req, res) => {
    const { name, type } = req.query
    let sql = 'select goods_id,goods_price,retail_price,goods_img,goods_name,goods_sales from goods where goods_name like ?'
    db.executeQuery(sql, [`%${name}%`]).then(list => {
      switch (type) {
        case '2':
          list = list.sort((a, b) => a.retail_price - b.retail_price)
          break
        case '3':
          list = list.sort((a, b) => b.retail_price - a.retail_price)
          break
        case '4':
          list = list.sort((a, b) => a.goods_sales - b.goods_sales)
          break
      }
      res.status(200).json({
        list
      })
    })
  },
  getHotSearchCateResult: (req, res) => {

  }
  // getFuzzyQuery: (req, res) => {
  //   const { name } = req.query

  //   let sql = 'select'
  // }
}


module.exports = searchServices