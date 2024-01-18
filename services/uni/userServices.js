const db = require('../../config/db.config')

const userServices = {
  updateUserInfo: async (req, res) => {
    const { nickname, sign, birthday, gender, u_id } = req.body
    try {
      let updateSql = 'update userinfo set nickname=?,sign=?,birthday=?,gender=? where u_id=?'
      await db.executeQuery(updateSql, [nickname, sign, birthday, gender, u_id])

      res.status(200).json({
        msg: 'success'
      })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal Server Error.' })
    }
  },
  getUserInfo: async (req, res) => {
    const user_id = req.userinfo.id
    // const user_id = 1
    let balance = null
    let card = []
    let sql = 'select * from user_ticket where user_id = ?'
    const data = await db.executeQuery(sql, [user_id])
    const ticket = data.filter(i => i.ticket_status == 0)
    const length = ticket.length //红包个数
    let sql_ = 'select money from userinfo where user_id = ?'
    const balanceData = await db.executeQuery(sql_, [user_id])
    balance = balanceData[0]  //余额
    let sqls = 'select * from card where user_id = ?'
    const cardData = await db.executeQuery(sqls, [user_id])
    let li_card = {
      card_name: '礼品卡',
      card_num: cardData[0].li_card,
      card_sign: 1
    }
    let h_card = {
      card_name: '提货卡',
      card_num: cardData[0].h_card,
      card_sign: 0
    }
    card.push(li_card, h_card)
    let sql1 = 'select * from card_change where card_id = ?'
    const cardInfo = await db.executeQuery(sql1, [cardData[0].card_id])
    cardInfo.forEach(item => {
      if (item.is_use == 0) {
        if (item.change_obj == 1) {
          item['change_obj'] = '礼品卡'
          card[0].children ? card[0].children.push(item) : card[0].children = [item]
        } else {
          item['change_obj'] = '提货卡'
          card[1].children ? card[1].children.push(item) : card[1].children = [item]
        }
      }
    })
    res.json({
      balance,
      card,
    })
  },
  verifyPayWord: (req, res) => {
    const user_id = req.userinfo.id
    const { pwd } = req.body
    console.log(req.body);
    console.log(pwd);
    let sql = 'select pay_word from user where id = ?'
    db.executeQuery(sql, [user_id]).then(data => {
      if (data[0].pay_word == pwd) {
        res.status(200).json({
          msg: '校验成功',
          code: 200
        })
      } else {
        res.status(401).json({
          msg: '校验失败',
          code: 401
        })
      }
    })
  },
  postUserMoneyAPI: async (req, res) => {
    const user_id = req.userinfo.id
    const { money, type, num } = req.body
    try {
      const time = new Date().getTime()
      let sql = 'update balance set num = ? where user_id = ?'
      await db.executeQuery(sql, [money, user_id])
      let insertSql = 'insert into bala_change(change_time,change_type,change_nums,user_id) values(?,?,?,?)'
      await db.executeQuery(insertSql, [time, type, num, user_id])
      res.status(200).json({
        msg: 'success'
      })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal Server Error.' })
    }
  },
  getUserChatRecordAPI: async (req, res) => {
    const user_id = req.userinfo.id
    try {
      let sql = 'select message where send_id = ? order by chat_time desc'
      const data = await db.executeQuery(sql, [user_id])
      let sql_ = 'select message where receiver_id = ? order by chat_time desc'
      const rData = await db.executeQuery(sql_, [user_id])


    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal Server Error.' })
    }
  }
}

module.exports = userServices