const db = require('../../config/db.config')
const cron = require('node-cron')


const cardServices = {
  updateCardItem: (req, res) => {

  },
  getCardChangeList: (req, res) => {
    const user_id = 1
    let s = 'select balance_id from balance where user_id = ?'
    let sql = 'select * from bala_change where balance_id = ?'
    db.executeQuery(s,[user_id]).then(data => {
      db.executeQuery(sql,[data[0].balance_id]).then(data => {
        res.status(200).json(({
          data
        }))
      })
    })
  }
}

// cron.schedule('* * * * *', () => {
//   // 查询数据库中超过有效时间且状态未更新的订单
//   let expiredOrders = null
//   let sql = 'select out_time,ticket_status,ticket_id,user_id from `user_ticket` where ticket_status = 0'
//   db.executeQuery(sql).then(data => {
//     console.log(1111);
//     if(data.length == 0) return
//     expiredOrders = data
//     //更新订单状态为过期
//     let promise = []
//     let sql_ = 'update `user_ticket` set ticket_status = ? where ticket_id = ?'
//     expiredOrders.forEach(item => {
//       let now = new Date()
//       let eff_time = new Date(item.out_time)
      
//       if (now > eff_time) {
//         promise.push(db.executeQuery(sql_, [2, item.ticket_id]))
//       }
//     })
//     return Promise.all(promise)
//   }).then()
// })

module.exports = cardServices