const db = require('../../config/db.config')
const { splitName } = require('../../hooks/address')

const addressServices = {
  getRegionList: (req, res) => {
    let sql = 'select * from regions where type = ?'
    let sqls = 'select * from regions where parent_id = ?'
    let arr = []
    db.executeQuery(sql, [1]).then(data => {
      let promise = []
      data.forEach(i => {
        let obj = {
          text: i.name,
          value: i.id
        }
        arr.push(obj)
        promise.push(db.executeQuery(sqls, [i.id]))
      })
      return Promise.all(promise)
    }).then(data => {
      arr.forEach(item => {
        data.flat().forEach(i => {
          if (i.parent_id == item.value) {
            let obj = {
              text: i.name,
              value: i.id
            }
            item.children ? item.children.push(obj) : item.children = [obj]
          }
        })
      })
      let promise = []
      data.flat().forEach(i => promise.push(db.executeQuery(sqls, [i.id])))
      return Promise.all(promise)
    }).then(data => {
      arr.forEach(item => {
        if (item.children) {
          item.children.forEach(subItem => {
            data.flat().forEach(i => {
              if (i.parent_id == subItem.value) {
                let obj = {
                  text: i.name,
                  value: i.id
                }
                subItem.children ? subItem.children.push(obj) : subItem.children = [obj]
              }
            })
          })
        }
      })
      res.send(arr)
    })
  },
  getAddressList: (req, res) => {
    const user_id = req.userinfo.id
    let arr = []
    let sql = 'select * from address where user_id = ?'
    db.executeQuery(sql, [user_id]).then((result) => {
      let promise = []
      arr = result
      let sql = 'select name,id from regions where id = ?'
      result.forEach(item => {
        promise.push(db.executeQuery(sql, [item.province_id]))
        promise.push(db.executeQuery(sql, [item.city_id]))
        promise.push(db.executeQuery(sql, [item.district_id]))
      })
      return Promise.all(promise)
    }).then(data => {
      splitName(data.flat()).forEach((item, index) => {
        arr[index].address = item
      })
      res.send(arr)
    })
  },
  delAddressList: (req, res) => {
    // const { addres_id: id } = req.body
    let sql = 'delete from address where addres_id = ?'
    db.executeQuery(sql, [id]).then(result => {
      console.log(result);
    })
  },
  addAddressList: (req, res) => {
    let user_id = 8
    let [province_id, city_id, district_id] = req.body.ids
    let { name, contact, adress, checked } = req.body
    let sql = `insert into address(user_id,name,contact,country_id,province_id,
               city_id,district_id,detail_adrs,is_default) values(?,?,?,?,?,?,?)`
    db.executeQuery(sql, [user_id, name, contact, province_id, city_id, district_id, adress, checked]).then(data => {
      console.log(data);
    })
  },
  updateAddressList: (req, res) => {
    const user_id = req.userinfo.id
    const { id:addres_id } = req.body
    let s = 'select addres_id from address where user_id = ?'
    db.executeQuery(s, [user_id]).then(data => {
      let sql = 'update address set is_selected = ? where addres_id = ?'
      let promise = []
      data.forEach(item => {
        promise.push(db.executeQuery(sql, ['0', item.addres_id]))
      })
      return Promise.all(promise).then((data) => {
        db.executeQuery(sql, ['1', addres_id]).then((data, err) => {
          if (err) {
            res.status(500).json({
              msg: '更新失败'
            })
          }
          res.json({
            msg: '更新成功',
            status: 200
          })
        })
      })
    })
  },
  updateAddressItem: (req, res) => {

  }
}


module.exports = addressServices




