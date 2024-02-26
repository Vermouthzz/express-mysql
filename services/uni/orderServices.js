const { json } = require('express')
const db = require('../../config/db.config')
const { Renames, ReCommon } = require('../../hooks/sku')
const cron = require('node-cron')
const { reServices } = require('../../hooks/goods')
const redis = require('../../config/redis.config')


const orderServices = {
  getOrderItem: async (req, res) => {
    const { id: order_id } = req.query
    let item = null
    let list = {}
    let getSql = 'select * from `order` where order_id = ?'
    const orderData = await db.executeQuery(getSql, [order_id])
    item = orderData[0]
    let arr = [
      { name: '支付方式', value: item.pay_mode },
      { name: '商品总价', value: item.all_price },
      { name: '邮费', value: 0 },
      { name: '活动优惠', value: item.active_fee },
    ]
    let pay = { name: '实付', value: item.pay_price.toFixed(2) }
    item.spec = {
      discount_info: arr,
      pay
    }
    delete item['user_id']
    list = item
    //获取具体地址
    let addresSql = 'select name from regions where id = ?'
    const adresPromise = [db.executeQuery(addresSql, [item.province_id]), db.executeQuery(addresSql, [item.city_id]), db.executeQuery(addresSql, [item.district_id])]
    const [province, city, district] = await Promise.all(adresPromise)
    let adresObj = {
      province: province[0].name,
      city: city[0].name,
      district: district[0].name
    }
    list.adres = adresObj

    // 获取商品信息
    let o_sql = 'select * from order_goods where order_id = ?'
    const result = await db.executeQuery(o_sql, [order_id])
    let promise = []
    let sql = 'select id,sp_id,pic,price,retail_price from goods_sku where id = ?'
    let sqls = 'select goods_name,goods_id from goods where goods_id = ?'
    result.forEach(subItem => {
      if (list.order_id == subItem.order_id) {
        list.children ? list.children.push(subItem) : list.children = [subItem]
      }
      promise.push(db.executeQuery(sql, [subItem.sku_id]))
      promise.push(db.executeQuery(sqls, [subItem.goods_id]))
    })
    const data = await Promise.all(promise)

    //获取商品属性
    let sp_sql = 'select * from sku_sp where sp_id = ?'
    let promise_ = []
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
      if (item.sp_id) promise_.push(db.executeQuery(sp_sql, [item.sp_id]))
    })
    const spData = await Promise.all(promise_)
    list.children.forEach(i => {
      spData.flat().forEach(item => {
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
  },
  createOrderService: async (req, res) => {
    // const orderKey = `order`
    try {
      let { cart, addres, fee, num, total, li_num } = req.body
      let { name, contact, country_id, province_id, city_id, district_id, detail_adrs } = addres
      const user_id = req.userinfo.id
      console.log(li_num, '-----', total);
      let time = new Date()
      let create_time = time.getTime()
      let e_time = new Date(time.setHours(time.getHours() + 1)).getTime()
      let order_id = '46' + Math.floor(Math.random() * (10000000))
      // redis.setex(orderKey, 3600, JSON.stringify(orderData))
      let sql = 'insert into `order`(order_id,user_id,create_time,effective_time,order_status,adress_name,country_id,province_id,city_id,district_id,detail_adrs,contact,pay_mode,active_fee,pay_price, all_price,li_nums)values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
      let sqlArr = [order_id, user_id, create_time, e_time, '0', name, country_id, province_id, city_id, district_id, detail_adrs, contact, '余额支付', fee, num, total, li_num]
      let promise = []
      await db.executeQuery(sql, sqlArr)
      let sqls = 'insert into order_goods(order_id,goods_id,sku_id, count) values(?,?,?,?)'
      cart.flat().forEach(item => {
        let arr = [order_id, item.goods_id, item.sku_id, item.count]
        promise.push(db.executeQuery(sqls, arr))
      })
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
  getOrderList: async (req, res) => {
    const user_id = req.userinfo.id
    const { type } = req.query
    let list = []
    let a = []
    try {
      let all_sql = 'select order_id,pay_price,order_status,effective_time from `order` where user_id = ? order by create_time desc'
      let sql = 'select order_id,pay_price,order_status,effective_time from `order` where user_id = ? and order_status = ? order by create_time desc'
      let orderList = []
      type == 5 ? orderList = await db.executeQuery(all_sql, [user_id]) : orderList = await db.executeQuery(sql, [user_id, type])

      list = orderList
      if (list.length > 0) {
        let sql_or = 'select * from order_goods where order_id = ?'
        let promise = []
        orderList.forEach(i => promise.push(db.executeQuery(sql_or, [i.order_id])))
        const orderData = await Promise.all(promise)

        let promises = []
        let sql_sku = 'select id,sp_id,pic from goods_sku where id = ?'
        let sqls = 'select goods_name,goods_id from goods where goods_id = ?'
        orderData.forEach(item => {
          item.forEach(subItem => {
            list.forEach(i => {
              if (i.order_id == subItem.order_id) {
                i.children ? i.children.push(subItem) : i.children = [subItem]
              }
            })
            promises.push(db.executeQuery(sql_sku, [subItem.sku_id]))
            promises.push(db.executeQuery(sqls, [subItem.goods_id]))
          })
        })
        const goodsData = await Promise.all(promises)

        let sql_sp = 'select * from sku_sp where sp_id = ?'
        let promise_ = []
        list.forEach(item => {
          item.children.forEach(i => {
            goodsData.flat().forEach(j => {
              promise_.push(db.executeQuery(sql_sp, [j.sp_id]))
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
        const data = await Promise.all(promise_)

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
      }

      res.json({
        status: 200,
        msg: 'good',
        data: list
      })
    } catch (error) {
      console.log(error);
    }
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
  },
  getCreateOrderItem: async (req, res) => {
    let { ids } = req.body
    try {
      let spec = null
      let sku_item = {}
      let sql = 'select id,sp_id,goods_id,pic,price,retail_price from goods_sku where id = ?'
      const skuData = await db.executeQuery(sql, [ids])

      let sp_sql = 'select * from sku_sp where sp_id = ?'
      const [spData] = await db.executeQuery(sp_sql, [skuData[0].sp_id])
      for (let key in spData) {
        //清楚对象属性值为null的属性
        if (spData[key] == null) {
          delete (spData[key])
        }
      }
      spec = Renames(spData)
      let service = 'select services,goods_id,goods_name as title from goods where goods_id = ?'
      const goodsService = await db.executeQuery(service, [skuData[0].goods_id])
      goodsService[0].service = reServices(goodsService[0].services)


      Object.assign(sku_item, skuData[0], goodsService[0])

      res.json({
        msg: 'success',
        result: {
          sku_item,
          spec
        },
      })
    } catch (error) {
      console.log(error);
    }
  }
}

// cron.schedule('* * * * *', async () => {
//   // 查询数据库中超过有效时间且状态未更新的订单
//   let expiredOrders = null
//   let sql = 'select order_id,create_time,effective_time,order_status from `order` where order_status = ?'
//   const data = await db.executeQuery(sql, [0])
//   if (data.length == 0) return
//   expiredOrders = data
//   //更新订单状态为过期
//   let promise = []
//   let sql_ = 'update `order` set order_status = ? where order_id = ?'
//   expiredOrders.forEach(async item => {
//     let now = new Date().getTime()
//     if (now >= item.effective_time) {
//       // if (li_nums > 0) {
//       //   let s_sql = 'select * from card_change where order_id = ? and is_use = ?'
//       //   const changeList = db.executeQuery(s_sql, [item.order_id, -1])
//       //   let card_sql = ''
//       //   // let insert = 'insert into '
//       // }
//       promise.push(db.executeQuery(sql_, [-1, item.order_id]))
//     }
//   })
//   await Promise.all(promise)
// });

module.exports = orderServices

