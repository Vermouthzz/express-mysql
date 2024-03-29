const db = require('../../config/db.config')
const cron = require('node-cron')

const ticket_quoteServices = {
  //用户使用红包逻辑
  updateStatusAPI: async (req, res) => {
    const { status, id } = req.body
    try {
      let sql = 'update user_ticket set ticket_status = ? where user_ticket_id = ?'
      await db.executeQuery(sql, [status, id])
      res.status(200).json({
        msg: '使用成功'
      })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal Server Error.' })
    }
  },
  getTicketListAPI: async (req, res) => {
    let arr = []
    // const user_id = req.userinfo.id
    const { type } = req.query
    const user_id = 1
    try {
      let sql = 'select * from user_ticket where user_id = ?'
      const data = await db.executeQuery(sql, [user_id])
      let promise = []
      let sql_ = 'select * from red_tickets where ticket_id = ?'
      data.forEach(item => {
        promise.push(db.executeQuery(sql_, [item.ticket_id]))
      })
      arr = data
      const list = await Promise.all(promise)
      arr.forEach(item => {
        list.flat().forEach(lItem => {
          if (lItem.ticket_id == item.ticket_id) {
            Object.assign(item, lItem)
          }
        })
      })
      res.status(200).json({
        result: arr,
      })
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Internal Server Error.' })
    }
  },
  // 获取可兑换红包list
  getExchangeTicketAPI: async (req, res) => {
    try {
      let sql = 'select * from red_tickets where is_exchange > ? order by is_exchange'
      const data = await db.executeQuery(sql, [0])
      res.status(200).json({
        result: data,
        msg: 'success'
      })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal Server Error.' })
    }
  },
  // 点击兑换红包逻辑
  onExchangeRedTicketAPI: async (req, res) => {
    const user_id = req.userinfo.id
    const { id, status, get_time } = req.body
    try {
      const out_time = Number(get_time) + 1000 * 60 * 60 * 24 * 7
      let sql = 'insert into user_ticket(user_id,ticket_id,ticket_status,get_time,out_time) values(?,?,?,?,?)'
      await db.executeQuery(sql, [user_id, id, status, get_time, out_time])
      res.status(200).json({
        msg: '兑换成功'
      })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal Server Error.' })
    }
  },
  //获取可兑换红包信息
  getTicketAPI: async (req, res) => {
    const { id } = req.query
    try {
      let sql = 'select * from red_tickets where ticket_id = ?'
      const data = await db.executeQuery(sql, [id])
      res.status(200).json({
        result: data[0],
        msg: 'success'
      })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal Server Error.' })
    }
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
          promise.push(db.executeQuery(s, [1, item.user_ticket_id]))
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