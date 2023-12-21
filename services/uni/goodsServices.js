const db = require('../../config/db.config')
const { reServices } = require('../../hooks/goods')
const goodsServices = {
  getGoodsInfo: async (req, res) => {
    const { id } = req.query
    try {
      // 查询商品信息
      let sql = 'select * from goods where goods_id = ?'
      let brand_id = null
      const result = await db.executeQuery(sql, [id])
      brand_id = result[0].brand_id
      let goods_desc = result[0].goods_desc.split('.')
      let goods_albums = result[0].goods_albums.split(',')
      result[0].service = reServices(result[0].services)
      if (result[0].goods_arg_imgs) {
        let goods_arg_imgs = result[0].goods_arg_imgs.split(',')
        Object.assign(result[0], { goods_desc, goods_albums, goods_argImg: goods_arg_imgs })
      } else {
        Object.assign(result[0], { goods_desc, goods_albums })
      }
      //查询商品参数
      let s_sql = 'select parameter_name,parameter_value from goods_argument where goods_id = ?'
      const argData = await db.executeQuery(s_sql, ['10126'])
      result[0].attrList = argData

      //查询商品品牌信息
      let b_sql = 'select * from brand where brand_id = ?'
      const brandData = await db.executeQuery(b_sql, [brand_id])
      result[0].brand_info = brandData[0]

      //查询相关商品信息
      // let c_sql = 'select parent_id from goods_category where category_id = ?'
      let sqls = 'select category_id from goods_category where parent_id = ?'
      // const [{ parent_id }] = await db.executeQuery(c_sql, [result[0].category_id])
      let ids = await db.executeQuery(sqls, [37])
      // let ids = await db.executeQuery(sqls, [parent_id])
      let promise = []
      let c_sql_ = 'select goods_id,goods_name,goods_price,retail_price,goods_img from goods where category_id = ?'
      ids.forEach(item => promise.push(db.executeQuery(c_sql_, [item.category_id])))
      const aboutGoods = await Promise.all(promise)
      let list = new Array(4).fill().map(() => [])
      list.forEach((item, index) => item.push(...aboutGoods.flat().slice(index * 6, (index + 1) * 6)))
      result[0].aboutGoods = list

      //查询24小时热销商品信息
      let h_sql = 'select category_id from goods_category where parent_id = ?'
      let c_ids = await db.executeQuery(h_sql, [289])
      let promises = []
      c_ids.forEach(item => promises.push(db.executeQuery(c_sql_, [item.category_id])))
      const hotGoods = await Promise.all(promises)
      let h_list = new Array(4).fill().map(() => [])
      h_list.forEach((item, index) => item.push(...hotGoods.flat().slice(index * 6, (index + 1) * 6)))
      result[0].hotGoods = h_list

      //响应结果
      res.status(200).json({
        result: result[0],
        msg: 'success'
      })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal Server Error.' })
    }
  },
  getBrandGoods: (req, res) => {
    // let { brand_id } = req.query
    let brand_id = 3
    let sql = 'select * from goods where brand_id = ?'
    let arr = []
    db.executeQuery(sql, [brand_id]).then(data => {
      arr = data
      let sql = 'SELECT sum(sale) as count,goods_id from goods_sku WHERE goods_id = ?'
      let promise = []
      data.forEach(item => {
        promise.push(db.executeQuery(sql, [item.goods_id]))
      })
      return Promise.all(promise)
    }).then(data => {
      arr.forEach(i => {
        data.flat().forEach(subItem => {
          if (subItem.goods_id == i.goods_id) {
            i.sale = subItem.count
          }
        })
      })
      let sql = 'select * from brand where brand_id = ?'
      db.executeQuery(sql, [brand_id]).then(result => {
        result = result.flat()
        result[0].count = arr.length
        res.json({
          status: 200,
          msg: '查询成功',
          data: {
            brand_info: result[0],
            brand_goods: arr
          }
        })
      })
    })
  }
}

module.exports = goodsServices

