const db = require('../../config/db.config')
let data = []
const homeServices = {
  getHomeInfo: async (req, res) => {
    let { page, pageSize, ids } = req.body
    if (page == 1) {
      let sql = 'select goods_id,retail_price,goods_name,goods_img,goods_price from goods order by rand()'
      let ca_sql = 'select category_id from goods_category where parent_id = ?'
      let sqls = 'select goods_id,retail_price,goods_name,goods_img,goods_price from goods where category_id = ?'
      if (ids.length > 0) {
        let promise = []
        let promises = []
        ids.forEach(item => promise.push(db.executeQuery(ca_sql, item)))
        const pId = await Promise.all(promise)
        pId.flat().forEach(item => promises.push(db.executeQuery(ca_sql, item.category_id)))
        const allId = await Promise.all(promises)
        let all = []
        allId.flat.forEach(item => all.push(db.executeQuery(sqls, item.category_id)))
        const result = await Promise.all(all)
        data = result.flat()

        res.status(200).json({
          msg: 'success',
          result: data.slice(0, 11)
        })
      } else {
        //猜你喜欢逻辑
        const result = await db.executeQuery(sql)
        let sqls_ = 'select img,id from home where swiper = ?'
        //swiper列表
        const list = await db.executeQuery(sqls_, [1])
        let rankSql = `SELECT goods_id, SUM(count) AS total_sales
        FROM order_goods
        GROUP BY goods_id
        ORDER BY total_sales DESC
        limit 1;`
        let goodsSql = 'select goods_img from goods where goods_id = ?'


        data = result
        res.status(200).json({
          msg: 'success',
          list,
          result: data.slice(0, 11)
        })
      }
    } else {
      let firstIndex = (page - 1) * pageSize
      let lastIndex = page * pageSize - 1
      let result = data.slice(firstIndex, lastIndex)
      res.status(200).json({
        msg: 'success',
        result
      })
    }
  },
  getHomeNavAPI: async (req, res) => {
    try {
      let sql = 'select category_name,category_id,img_url,parent_id from goods_category where level = ? ORDER BY RAND() LIMIT 20'
      const data = await db.executeQuery(sql, [2])
      const arr = new Array(10).fill().map(() => [])
      arr.forEach((item, index) => item.push(...data.slice(index * 2, (index + 1) * 2)))

      let sqls = `SELECT search_text as name, COUNT(*) AS occurrence_count
      FROM search
      GROUP BY search_text
      ORDER BY occurrence_count DESC
      LIMIT 10;`
      const searchData = await db.executeQuery(sqls)
      res.json({
        msg: 'success',
        result: {
          navList: arr,
          data: searchData
        }
      })
    } catch (error) {

    }
  }
}

module.exports = homeServices