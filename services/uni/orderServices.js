const db = require('../../config/db.config')
const { Renames, ReCommon } = require('../../hooks/sku')
const cron = require('node-cron')

const orderServices = {
  getOrderItem: (req, res) => {
    const { id: order_id } = req.query
    let item = null
    let list = {}
    let sql = 'select * from `order` where order_id = ?'
    db.executeQuery(sql, [order_id]).then(data => {
      item = data[0]
      let arr = [
        { name: '支付方式', value: item.pay_mode },
        { name: '商品总价', value: item.all_price },
        { name: '邮费', value: 0 },
        { name: '活动优惠', value: item.active_fee },
        { name: '应付合计', value: item.pay_price.toFixed(2) }
      ]
      item.spec = arr
      delete item['user_id']
      list = item
      let sql = 'select * from order_goods where order_id = ?'
      db.executeQuery(sql, [order_id]).then(data => {
        let promise = []
        let sql = 'select id,sp_id,pic from goods_sku where id = ?'
        let sqls = 'select goods_name,goods_id from goods where goods_id = ?'
        data.forEach(subItem => {
          if (list.order_id == subItem.order_id) {
            list.children ? list.children.push(subItem) : list.children = [subItem]
          }
          promise.push(db.executeQuery(sql, [subItem.sku_id]))
          promise.push(db.executeQuery(sqls, [subItem.goods_id]))
        })
        return Promise.all(promise)
      }).then(data => {
        let sql = 'select * from sku_sp where sp_id = ?'
        let promise = []
        data.flat().forEach(item => {
          list.children.forEach(i => {
            if (i.goods_id == item.goods_id) {
              Object.assign(i, item)
            }
            if (item.id == i.sku_id) {
              delete i['id']
              Object.assign(i, item)
            }
          })
          if (item.sp_id) promise.push(db.executeQuery(sql, [item.sp_id]))
        })
        return Promise.all(promise)
      }).then(data => {
        list.children.forEach(i => {
          data.flat().forEach(item => {
            for (let key in item) {
              //清楚对象属性值为null的属性
              if (item[key] == null) {
                delete (item[key])
              }
            }
            if (item.sp_id == i.sp_id) {
              i.spec = Renames(item).map(z => z.value).join('')
            }
          })
        })
        res.json({
          status: 200,
          msg: 'good',
          list
        })
      })
    })
  },
  createOrderService: async (req, res) => {
    try {
      let { cart, addres, fee, num } = req.body
      let { name, contact, country_id, province_id, city_id, district_id, detail_adrs } = addres
      const user_id = req.userinfo.id
      let time = new Date()
      let create_time = time.toLocaleString()
      let e_time = new Date(time.setHours(time.getHours() + 1)).toLocaleString()
      let order_id = '46' + Math.floor(Math.random() * (10000000))
      let sql = 'insert into `order`(order_id,user_id,create_time,effective_time,order_status,adress_name,country_id,province_id,city_id,district_id,detail_adrs,contact,pay_mode,active_fee,pay_price)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
      let sqlArr = [order_id, user_id, create_time, e_time, '0', name, country_id, province_id, city_id, district_id, detail_adrs, contact, '余额支付', fee, num]
      let promise = []
      const data = await db.executeQuery(sql, sqlArr)
      if (data.affectedRows == 1) {
        let sqls = 'insert into order_goods(order_id,goods_id,sku_id) values(?,?,?)'
        cart.flat().forEach(item => {
          let arr = [order_id, item.goods_id, item.sku_id]
          promise.push(db.executeQuery(sqls, arr))
        })
      }
      await Promise.all(promise)
      res.json({
        status: 200,
        msg: '创建订单成功',
        data: {
          id: order_id
        }
      })
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Internal Server Error.' })
    }
  },
  delOrderItem: (req, res) => {

  },
  getOrderList: (req, res) => {
    const user_id = req.userinfo.id
    let list = []
    let a = []
    let sql = 'select order_id,pay_price,order_status,effective_time from `order` where user_id = ? order by create_time desc'
    db.executeQuery(sql, [user_id]).then(data => {
      list = data
      let sql = 'select * from order_goods where order_id = ?'
      let promise = []
      data.forEach(i => promise.push(db.executeQuery(sql, [i.order_id])))
      return Promise.all(promise)
    }).then(data => {
      let promise = []
      let sql = 'select id,sp_id,pic from goods_sku where id = ?'
      let sqls = 'select goods_name,goods_id from goods where goods_id = ?'
      data.forEach(item => {
        item.forEach(subItem => {
          list.forEach(i => {
            if (i.order_id == subItem.order_id) {
              i.children ? i.children.push(subItem) : i.children = [subItem]
            }
          })
          promise.push(db.executeQuery(sql, [subItem.sku_id]))
          promise.push(db.executeQuery(sqls, [subItem.goods_id]))
        })
      })
      return Promise.all(promise)
    }).then(data => {
      let sql = 'select * from sku_sp where sp_id = ?'
      let promise = []
      list.forEach(item => {
        item.children.forEach(i => {
          data.flat().forEach(j => {
            promise.push(db.executeQuery(sql, [j.sp_id]))
            if (j.goods_id == i.goods_id) {
              Object.assign(i, j)
            }
            if (j.id == i.sku_id) {
              delete j['id']
              Object.assign(i, j)
            }
          })
        })
      })
      return Promise.all(promise)
    }).then(data => {

      list.forEach(listi => {
        listi.children.forEach(i => {
          data.flat().forEach(item => {
            for (let key in item) {
              //清楚对象属性值为null的属性
              if (item[key] == null) {
                delete (item[key])
              }
            }
            if (item.sp_id == i.sp_id) {
              i.spec = Renames(item).map(z => z.value).join('')
            }
          })
        })
      })
      res.json({
        status: 200,
        msg: 'good',
        data: list
      })
    })
  },
  updateOrderItem: async (req, res) => {
    const { type, id } = req.body
    try {
      let sql = 'update `order` set order_status = ? where order_id = ?'
      await db.executeQuery(sql, [type, id])
      res.status(200).json({
        msg: 'success'
      })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal Server Error.' })
    }
  }
}

cron.schedule('* * * * *', () => {
  // 查询数据库中超过有效时间且状态未更新的订单
  let expiredOrders = null
  let sql = 'select order_id,create_time,effective_time,order_status from `order` where order_status = 0'
  db.executeQuery(sql).then(data => {
    if (data.length == 0) return
    expiredOrders = data
    //更新订单状态为过期
    let promise = []
    let sql_ = 'update `order` set order_status = ? where order_id = ?'
    expiredOrders.forEach(item => {
      let now = new Date()
      let eff_time = new Date(item.effective_time)
      console.log(now, eff_time);
      if (now > eff_time) {
        promise.push(db.executeQuery(sql_, [-1, item.order_id]))
      }
    })
    return Promise.all(promise)
  }).then()
});

module.exports = orderServices

