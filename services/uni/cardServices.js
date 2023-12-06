const db = require('../../config/db.config')
const cron = require('node-cron')


const cardServices = {
  updateCardItem: (req, res) => {

  },
  getCardChangeList: (req, res) => {
    const user_id = 1
    let s = 'select balance_id from balance where user_id = ?'
    let sql = 'select * from bala_change where balance_id = ?'
    db.executeQuery(s, [user_id]).then(data => {
      db.executeQuery(sql, [data[0].balance_id]).then(data => {
        res.status(200).json(({
          data
        }))
      })
    })
  }
}

cron.schedule('* * * * *', () => {
  // 查询数据库中超过有效时间且状态未更新的订单
  let expiredOrders = null
  let sql = 'select out_time,ticket_status,ticket_id,id,sign from `user_ticket` where ticket_status = ?'
  db.executeQuery(sql,[0]).then(data => {
    if (data.length == 0) return
    expiredOrders = data
    //更新订单状态为过期
    let promise = []
    let sql_ = 'update `user_ticket` set ticket_status = ? where id = ?'
    expiredOrders.forEach(item => {
      let now = new Date()
      let eff_time = new Date(item.out_time)
      let delay_time = eff_time.getTime() - 1000 * 60 * 60 * 36
      if (item.sign == 0) {
        if (now > delay_time && now < eff_time) {
          let s = 'update  `user_ticket` set sign = ? where id = ?'
          Promise.push(db.executeQuery(s, [1, item.id]))
        }
      }
      if (now > eff_time) {
        promise.push(db.executeQuery(sql_, [2,item.id]))
      }
    })
    return Promise.all(promise)
  }).then()
})

module.exports = cardServices