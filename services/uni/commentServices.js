const db = require('../../config/db.config')
const { nanoid } = require('nanoid')
const fs = require('fs')

const commentServices = {
  getCommentList: async (req, res) => {
    let goods_id = 10017
    try {
      let sql = 'select * from goods_comment where goods_id = ?'
      let arr = []
      const result = await db.executeQuery(sql, [goods_id])
      arr = result
      let promise = []
      let sqls = 'select nickname,avator,u_id from userinfo where u_id = ?'
      result.forEach(item => {
        promise.push(db.executeQuery(sqls, [item.user_id]))
      })
      const data = await Promise.all(promise)
      data.flat().forEach(item => {
        arr.forEach(subItem => {
          if (subItem.user_id == item.u_id) {
            Object.assign(subItem, { user_name: item.nickname, user_avator: item.avator })
            delete subItem['user_id']
          }
        })
      })
      res.json({
        msg: 'success',
        result: arr
      })
    } catch (error) {

    }
  },
  addCommentItem: async (req, res) => {
    const file = req.files
    const user_id = req.userinfo.id
    const { star, text, date, goods_id, id, sku } = req.body
    let oldName = file[0].filename
    let newName = Buffer.from(file[0].originalname, 'latin1').toString('utf-8')
    fs.renameSync(`./public/upload/${oldName}`, `./public/upload/${newName}`)
    const img = `http://127.0.0.1:3000/upload/${newName}`
    try {
      let comment_id = ''
      if (id == 'none') {
        comment_id = nanoid(8)
        let sql = 'insert into goods_comment(comment_id,user_id,picture,text,date,goods_id,star) values(?,?,?,?,?,?,?)'
        await db.executeQuery(sql, [comment_id, user_id, img, text, date, goods_id, star])

      } else {
        comment_id = id
        let sql = 'update goods_comment set picture = ? where comment_id = ?'
        let selectSql = 'select picture,comment_id from goods_comment where comment_id = ?'
        const [data] = await db.executeQuery(selectSql, [comment_id])
        console.log(data);
        const picture = `${data.picture},${img}`
        await db.executeQuery(sql, [picture, comment_id])
      }

      res.json({
        msg: 'success',
        id: comment_id
      })
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Internal Server Error.' })
    }
  },
  getCommentGoodsAPI: async (req, res) => {
    const { order_id } = req.query
    try {
      let sql = 'select goods_id,sku_id,count,order_id from `order_goods` where order_id = ?'
      const [orderInfo] = await db.executeQuery(sql, [order_id])
      let skuSql = 'select sp_id,pic from goods_sku where id = ? and goods_id = ?'
      const [skuInfo] = await db.executeQuery(skuSql, [orderInfo.sku_id, orderInfo.goods_id])

      let goodsSql = 'select goods_name,goods_id from goods where goods_id = ?'
      const [goodsInfo] = await db.executeQuery(goodsSql, [orderInfo.goods_id])

      let sp_sql = 'select * from sku_sp where sp_id = ?'
      const [spData] = await db.executeQuery(sp_sql, skuInfo.sp_id)

      delete spData['sp_id']
      for (let key in spData) {
        if (!spData[key])
          delete spData[key]
      }
      const sku = Object.values(spData).join('')
      goodsInfo.sku = sku
      goodsInfo.order_id = order_id
      Object.assign(goodsInfo, skuInfo)
      res.json({
        msg: 'success',
        result: goodsInfo
      })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal Server Error.' })
    }
  }
}

module.exports = commentServices