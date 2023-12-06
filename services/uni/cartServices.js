const db = require('../../config/db.config')
const { reServices } = require('../../hooks/goods')
const { nanoid } = require('nanoid')
const _ = require('lodash')
const { Renames, reFee } = require('../../hooks/sku')
const cartServices = {
  getCartList: (req, res) => {
    let { user_id } = req.query
    let arr = []
    let sql = 'select id from cart where user_id = ?'
    db.executeQuery(sql, [user_id]).then(data => {
      let sql = 'select * from cartitem where cart_id = ?'
      let id = data[0].id
      db.executeQuery(sql, [id]).then(result => {
        let sql = 'select * from goods_sku where id = ?'
        let promise = []
        arr = result
        result.forEach(item => {
          item.is_selected == 1 ? item.selected = true : item.selected = false
          delete item['is_selected']
          promise.push(db.executeQuery(sql, [item.sku_id]))
        })
        return Promise.all(promise)
      }).then(data => {
        let promise = []
        let sql = 'select goods_id,goods_name,services,goods_fee from goods where goods_id = ?'
        data.flat().forEach(item => {
          arr.forEach(i => {
            if (item.id == i.sku_id) {
              i.sku_item = item
            }
          })
          promise.push(db.executeQuery(sql, [item.goods_id]))
        })
        return Promise.all(promise)
      }).then(data => {
        let sql = 'select * from sku_sp where sp_id = ?'
        let promise = []
        data.flat().forEach(i => {
          i.services = reServices(i.services)
          // i.goods_fee = reServices(i.goods_fee, 'f')
        })
        arr.forEach(item => {
          data.flat().forEach(i => {
            if (item.sku_item.goods_id == i.goods_id) {
              let obj = {
                title: i.goods_name,
                service: i.services
              }
              Object.assign(item.sku_item, obj)
              item.cart_fee = i.goods_fee
            }
          })
          promise.push(db.executeQuery(sql, [item.sku_item.sp_id]))
        })
        return Promise.all(promise)
      }).then(data => {
        data.flat().forEach(item => {
          let obj = _.omitBy(item, i => {
            return !i
          })
          arr.forEach(subItem => {
            if (subItem.sku_item.sp_id == obj.sp_id) {
              obj = Renames(obj)
              subItem.spec = obj
            }
          })
        })
        const sortArr = arr.reduce((acc, curr) => {
          if (!acc[curr.cart_fee]) {
            acc[curr.cart_fee] = [{ cart_fee: curr.cart_fee, value: [] }]
          }
          acc[curr.cart_fee][0].value.push(curr)
          return acc
        }, [])
        sortArr.flat().forEach(subItem => {
          subItem.cart_fee = reFee(subItem.cart_fee)
          subItem.value.forEach(item => {
            item.cart_fee = reFee(item.cart_fee)
          })
        })
        res.send(sortArr.filter(i => i != null))
      })
    })
  },
  addCartList: (req, res) => {
    let id = nanoid()
    const user_id = req.userinfo.id
    let { sku_id, count, goods_id, checked } = req.body
    let sql = 'select id from cart where user_id = ?'
    db.executeQuery(sql, [user_id]).then(data => {
      let sql = 'insert into cartitem(item_id,sku_id,count,goods_id,is_selected,cart_id) values(?,?,?,?,?,?)'
      db.executeQuery(sql, [id, sku_id, count, goods_id, checked,data[0].id]).then(data => {
        if (data.affectedRows == 1) {
          if (data.affectedRows == 1) {
            res.json({
              status: 200,
              msg: '加入购物车成功'
            })
          }
        }
      })
    })
  },
  delCartList: (req, res) => {
    // let { id } = req.query
    let { id } = req.body
    let sql = 'DELETE FROM cartitem WHERE item_id = ?'
    db.executeQuery(sql, [id]).then(result => {
      if (result.affectedRows == 1) {
        res.json({
          status: 200,
          mmsg: '删除成功'
        })
      }
    })
  },
  updateCartItem: (req, res) => {
    const { list: item } = req.body
    let sql = 'update cartitem set count = ?, is_selected = ?, sku_id = ? where item_id = ?'
    if (Array.isArray(item)) {
      let promise = []
      item.forEach(i => {
        promise.push(db.executeQuery(sql, [i.count, i.selected, i.sku_id, i.item_id]))
      })
      return Promise.all(promise).then(data => {
        res.json({
          status: 200,
          msg: '修改成功'
        })
      }).catch(() => {
        res.json({
          status: 403,
          msg: '修改失败'
        })
      })
    } else {
      db.executeQuery(sql, [item.count, item.selected, item.sku_id, item.item_id]).then((data) => {
        if (data.affectedRows == 1) {
          res.json({
            status: 200,
            msg: '修改成功'
          })
        }
      }).catch(() => {
        res.json({
          status: 403,
          msg: '修改失败'
        })
      })
    }
  }
}
// const updateMap = new Map([
//   [1, 'update cartitem set count = ? where item_id = ?'],
//   [2, 'update cartitem set is_selected = ? where item_id = ?'],
//   [3, 'update cartitem set count = ?, is_selected = ?, sku_id = ? where item_id = ?'],
// ])

module.exports = cartServices