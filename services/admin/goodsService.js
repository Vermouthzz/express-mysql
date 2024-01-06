const db = require('../../config/db.config')

const goodsService = {
  getGoodsListAPI: async (req, res) => {
    try {
      let sql = 'select goods_id,goods_name,goods_price,retail_price,goods_img,goods_pull,brand_id,category_id from goods'
      const data = await db.executeQuery(sql)
      res.status(200).json({
        result: data
      })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal Server Error.' })
      
    }
  }
}

module.exports = goodsService