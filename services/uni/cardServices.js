const db = require('../../config/db.config')


const cardServices = {
  //用户使用全部礼品卡
  updateCardItemAPI: async (req, res) => {
    const user_id = 1
    // const user_id = req.userinfo.id
    const order_id = 123
    const type = 0
    const use = 1 //是否使用
    try {
      // let sql = 'update card_change set order_id = ?, change_type = ? where user_id = ? and is_use = ?'

      // await db.executeQuery(sql, [order_id, type, user_id, use])
      let u_sql = 'select card_id from card where user_id = ? and is_use =  ?'
      const [{ card_id }] = await db.executeQuery(u_sql, [user_id, 0])
      let sql = 'select * from card_change where card_id = ?'
      const list = await db.executeQuery(sql, [card_id])
      let promise = []
      let s = 'insert into card_change(card_id,change_num,change_type,change_obj,show_id,effective_time,is_use,order_id) values()'
      list.forEach(item => {
        promise.push(db.executeQuery(s,[item.card_id,item.change_num,type,item.change_obj,item.show_id,item.effective_time,use,order_id]))
      })
      await Promise.all(promise)
      res.status(200).json({
        msg: 'success'
      })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal Server Error.' })
    }
  },
  getBalanceChangeList: (req, res) => {
    const user_id = req.userinfo.id
    let s = 'select balance_id from balance where user_id = ?'
    let sql = 'select * from bala_change where balance_id = ?'
    db.executeQuery(s, [user_id]).then(data => {
      db.executeQuery(sql, [data[0].balance_id]).then(data => {
        res.status(200).json(({
          data
        }))
      })
    })
  },
  getCardChangeList: (req, res) => {
    const user_id = req.userinfo.id
    const { type } = req.query
    let sql = 'select card_id from card where user_id = ?'
    db.executeQuery(sql, [user_id]).then(data => {
      let id = data[0].card_id
      let sql = 'select * from card_change where card_id = ?'
      db.executeQuery(sql, [id]).then(data => {
        data = data.filter(item => item.change_obj == type)
        res.status(200).json(({
          data
        }))
      })
    })
  }
}



module.exports = cardServices