const db = require('../../config/db.config')


const cardServices = {
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
  },
  //获取礼品卡,提货卡List
  getCardListAPI: async (req, res) => {
    const user_id = 1
    const card = []
    try {
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
      res.status(200).json({
        msg: 'success',
        result: card
      })
    } catch (error) {

    }
  },
  //用户充值礼品卡
  putCardItemsAPI: async (req, res) => {
    const user_id = req.userinfo.id
    const { num } = req.body
    try {
      let u_sql = 'select card_id,li_num from card where user_id = ?'
      const [{ card_id, li_num }] = await db.executeQuery(u_sql, [user_id])
      let insert_sql = 'insert into card_change(card_id,change_num,change_type,change_obj,show_id,effective_time,is_use) values(?,?,?,?,?,?,?)'
      await db.executeQuery(insert_sql, [card_id, num, 1, 1, show_id, time, 0])

      //更新用户card_num
      let getSql = 'update card set li_num = ? where user_id = ?'
      const newNum = li_num + num
      await db.executeQuery(getSql, [newNum, user_id])
    } catch (error) {

    }
  },
  //用户使用全部礼品卡
  updateCardItemAPI: async (req, res) => {
    const user_id = req.userinfo.id
    const { order_id, type, is_use } = req.body
    console.log(order_id, type, is_use);
    //type值为0和-1，is_use值为1和-1,0
    //创建订单type=0,is_use=-1
    //取消订单type -1, is_use = 0
    //订单支付成功 type -1, is_use = 1
    try {
      //获取用户card_id
      let u_sql = 'select card_id from card where user_id = ?'
      const [{ card_id }] = await db.executeQuery(u_sql, [user_id])
      //获取用户未使用的礼品卡记录
      let use = 0 //第一次查找为未使用的
      if (type == -1) {
        use = -1 //查找为支付订单的
      }
      let sql = 'select * from card_change where card_id = ? and is_use = ? and change_obj = ?'
      const list = await db.executeQuery(sql, [card_id, use, 1])
      let promise = []
      //修改礼品卡记录为已使用
      let s = 'insert into card_change(card_id,change_num,change_type,change_obj,show_id,effective_time,is_use,order_id) values(?,?,?,?,?,?,?,?)'
      let update_sql = 'update card_change set is_use = ? where card_id = ? and change_obj = ?'
      if (is_use == 1) {  //支付成功
        await db.executeQuery(update_sql, [is_use, card_id, 1])
      } else if (is_use == 0) {  //取消订单
        list.forEach(item => {
          let arr = [item.card_id, item.change_num, type, item.change_obj, item.show_id, item.effective_time, is_use, order_id]
          promise.push(db.executeQuery(s, arr))
        })
        await Promise.all(promise)
      } else { //退还(is_use == -1)
        await db.executeQuery(update_sql, [1, card_id, 1])
        list.forEach(item => {
          let arr = [item.card_id, item.change_num, type, item.change_obj, item.show_id, item.effective_time, is_use, order_id]
          promise.push(db.executeQuery(s, arr))
        })
        await Promise.all(promise)
      }
      let num = 0
      if (is_use == 0) {
        list.forEach(i => num += i.change_num)
      }
      //将card_num设为0
      let sql_ = 'update card set li_card = ? where user_id = ?'
      await db.executeQuery(sql_, [num, user_id])
      res.status(200).json({
        msg: 'success'
      })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal Server Error.' })
    }
  }
}



module.exports = cardServices