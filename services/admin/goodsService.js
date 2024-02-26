const db = require('../../config/db.config')
const redis = require('../../config/redis.config')

const goodsService = {
  getGoodsListAPI: async (req, res) => {
    const { pageNum, pageSize } = req.query
    const redisKey = `goodsList:${pageNum}`
    const totalKey = `goodsList:total`
    try {
      let goodsData = await redis.syncGet(redisKey)
      let total = await redis.syncGet(totalKey)
      if (!goodsData) {
        console.log(111);
        const offset = (pageNum - 1) * pageSize
        if (!total) {
          let sqls = 'SELECT COUNT(*) as count from goods'
          const [{ count }] = await db.executeQuery(sqls)
          redis.setex(totalKey, 3600, count)
          total = count
        }
        let sql = `select goods_id,goods_name,goods_price,retail_price,goods_img,goods_pull,brand_id,category_id from goods limit ${pageSize} offset ?`
        const data = await db.executeQuery(sql, [offset])
        data.forEach(item => item.goods_pull == 1 ? item.goods_pull = true : item.goods_pull = false)

        redis.setex(redisKey, 3600, JSON.stringify(data))
        goodsData = data
      }
      res.json({
        result: goodsData,
        code: 200,
        total
      })
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Internal Server Error.' })
    }
  }
}

module.exports = goodsService