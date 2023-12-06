const db = require('../../config/db.config')
const _ = require('lodash')
const { Renames, ReCommon } = require('../../hooks/sku')
const { reServices } = require('../../hooks/goods')
let loveList = []
const listServices = {
  getLoveList: (req, res) => {
    let { page, pageSize } = req.query
    let start = (page - 1) * pageSize
    let end = page * pageSize
    if (page == 1) {
      let list = ['290', '39', '40']
      let sql = 'select parent_id from goods_category where category_id = ?'
      let promise = []
      list.forEach(item => {
        promise.push(db.executeQuery(sql, [item]))
      })
      return Promise.all(promise).then(data => {
        let promise = []
        let sql = 'select category_id from goods_category where parent_id = ?'
        data.flat().forEach(item => {
          promise.push(db.executeQuery(sql, [item.parent_id]))
        })
        return Promise.all(promise)
      }).then(data => {
        let arr = _.uniqWith(data.flat(), _.isEqual)  //去重

        let sql = 'select goods_id from goods where category_id = ?'
        let promise = []
        arr.forEach(item => {
          promise.push(db.executeQuery(sql, [item.category_id]))
        })
        return Promise.all(promise)
      }).then(data => {
        let shuffleArr = _.shuffle(data.flat())
        let promise = []
        let sql = 'select goods_id,goods_name,goods_img,goods_price from goods where goods_id = ?'
        shuffleArr.forEach(item => {
          promise.push(db.executeQuery(sql, [item.goods_id]))
        })
        return Promise.all(promise)
      }).then(data => {
        loveList = data.flat()
        res.json({
          status: 200,
          msg: '查询成功',
          data: loveList.slice(start, end)
        })
      })
    } else {
      res.json({
        status: 200,
        msg: '查询成功',
        data: loveList.slice(start, end)
      })
    }
  },
  getSkuList: (req, res) => {
    let { goods_id } = req.query
    let user_id = 1
    let arr = []
    let spec = []
    let service = ''
    let img = ''
    let price = 0
    let sql = 'select services,goods_img,goods_price from goods where goods_id = ?'
    db.executeQuery(sql, [goods_id]).then(data => {
      service = reServices(data[0].services)
      img = data[0].goods_img
      price = data[0].goods_price
      let sql = ' SELECT * from goods_sku WHERE goods_id =?'
      db.executeQuery(sql, [goods_id]).then(results => {
        let sqls = 'select * from sku_sp where sp_id = ?'
        let promise = []
        arr = results
        results.forEach(item => {
          promise.push(db.executeQuery(sqls, [item.sp_id]))
        })
        return Promise.all(promise)
      }).then(data => {
        arr.forEach(arrItem => {
          //sku处理
          data.flat().forEach(item => {
            for (let key in item) {
              //清楚对象属性值为null的属性
              if (item[key] == null) {
                delete (item[key])
              }
            }
            if (item.sp_id == arrItem.sp_id) {
              arrItem.spec = Renames(item)
              spec.push(Renames(item, 'list'))
            }
          })
        })
        spec = ReCommon(spec)
        res.json({
          status: 200,
          msg: '查询成功',
          data: {
            goods_price: price,
            goods_img: img,
            service,
            sku_list: spec,
            sku: arr
          }
        })
      })
    })
  },
}
module.exports = listServices
