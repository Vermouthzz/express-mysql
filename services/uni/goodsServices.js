const db = require('../../config/db.config')
const { ReCommon, Renames } = require('../../hooks/sku')
const { reServices } = require('../../hooks/goods')
const goodsServices = {
  getGoodsInfo: (req, res) => {
    const { id } = req.query
    let sql = 'select * from goods where goods_id = ?'
    let brand_id = null
    db.executeQuery(sql, [id]).then(result => {
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
      let s_sql = 'select * from goods_argument where goods_id = ?'
      db.executeQuery(s_sql, ['10005']).then(argData => {
        for (let k in argData[0]) {
          if (argData[0][k] == null || argData[0][k] == "") {
            delete argData[0][k]
          }
        }
        result[0].arguments = Renames(argData[0], 'arg')
        let b_sql = 'select * from brand where brand_id = ?'
        db.executeQuery(b_sql, [brand_id]).then(brandData => {
          result[0].brand_info = brandData[0]
          res.send(result[0])
        })
      })
    })
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

