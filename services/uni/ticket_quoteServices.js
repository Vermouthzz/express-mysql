const db = require('../../config/db.config')
const cron = require('node-cron')

const ticket_quoteServices = {
  updateStatusAPI: (req, res) => {
    let sql = 'update user_ticket set ticket_status = ? where user_ticket_id = ?'
    db.executeQuery(sql, [2, id]).then(data => {
      // if(data)
      res.status(200).json({
        msg: '使用成功'
      })
    })
  },
  getTicketListAPI: (req, res) => {
    let arr = []
    // const user_id = req.userinfo.id
    const user_id = 1
    let sql = 'select * from user_ticket where user_id = ?'
    db.executeQuery(sql, [user_id]).then(data => {
      let promise = []
      let sql = 'select * from red_tickets where ticket_id = ?'
      data.forEach(item => {
        promise.push(db.executeQuery(sql, [item.ticket_id]))
      })
      arr = data.reduce((a, b) => {
        if (a[b.ticket_status]) {
          a[b.ticket_status].value.push(b)
        } else {
          let obj = {
            name: b.ticket_status == 0 ? '未使用' : b.ticket_status == 1 ? '已使用' : '已过期',
            value: [b]
          }
          a[b.ticket_status] = obj
        }
        return a
      }, [])

      return Promise.all(promise)
    }).then(data => {
      arr.forEach(item => {
        item.value.forEach(i => {
          data.flat().forEach(subItem => {
            if (i.ticket_id == subItem.ticket_id) {
              Object.assign(i, subItem)
            }
          })
        })
      })
      res.status(200).json({
        data: arr,
      })
    })
  }
}



cron.schedule('* * * * *', () => {
  // 查询数据库中超过有效时间且状态未更新的红包
  let expiredOrders = null
  let sql = 'select out_time,ticket_status,ticket_id,user_ticket_id,sign from `user_ticket` where ticket_status = ?'
  db.executeQuery(sql, [0]).then(data => {
    if (data.length == 0) return
    expiredOrders = data
    //更新订单状态为过期
    let promise = []
    let sql_ = 'update `user_ticket` set ticket_status = ? where user_ticket_id = ?'
    expiredOrders.forEach(item => {
      let now = new Date()
      let eff_time = new Date(item.out_time)
      let delay_time = eff_time.getTime() - 1000 * 60 * 60 * 36
      if (item.sign == 0) {
        if (now > delay_time && now < eff_time) {
          let s = 'update  `user_ticket` set sign = ? where user_ticket_id = ?'
          Promise.push(db.executeQuery(s, [1, item.user_ticket_id]))
        }
      }
      if (now > eff_time) {
        promise.push(db.executeQuery(sql_, [2, item.user_ticket_id]))
      }
    })
    return Promise.all(promise)
  }).then()
})

module.exports = ticket_quoteServices