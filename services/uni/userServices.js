const db = require('../../config/db.config')

const userServices = {
  updateUserInfo: (req, res) => {
    const { nickname, sign, birthday, gender, u_id } = req.body
    console.log(nickname, sign, birthday, gender, u_id);
    let updateSql = 'update userinfo set nickname=?,sign=?,birthday=?,gender=? where u_id=?'
    db.query(updateSql, [nickname, sign, birthday, gender, u_id], (err, result) => {
      console.log(result);
      if (result.affectedRows === 1) {
        res.json({
          status: '200',
          msg: '更新成功',
        })
      }
    })
  },
  getUserInfo: (req, res) => {
    // const user_id = req.userinfo.id
    const user_id = 1
    let arr = []
    let balance = null
    let card = []
    let sql = 'select * from user_ticket where user_id = ?'
    db.executeQuery(sql, [user_id]).then(data => {
      let promise = []
      let sql = 'select * from red_tickets where ticket_id = ?'
      arr = data.filter(item => item.ticket_status == 0)
      arr.forEach(item => {
        promise.push(db.executeQuery(sql, [item.ticket_id]))
      })
      return Promise.all(promise)
    }).then(data => {
      arr.forEach(item => {
        data.flat().forEach(subItem => {
          if (item.ticket_id == subItem.ticket_id) {
            Object.assign(item, subItem)
          }
        })
      })
      let sql = 'select * from balance where user_id = ?'
      db.executeQuery(sql, [user_id]).then(data => {
        balance = data[0]
        let sql = 'select * from card where user_id = ?'
        db.executeQuery(sql, [user_id]).then(data => {
          let li_card = {
            card_name: '礼品卡',
            card_num: data[0].li_card,
            card_sign: 1
          }
          let h_card = {
            card_name: '提货卡',
            card_num: data[0].h_card,
            card_sign: 0
          }
          card.push(li_card, h_card)
          let sql = 'select * from card_change where card_id = ?'
          db.executeQuery(sql, [data[0].card_id]).then(data => {
            data.forEach(item => {
              if (item.change_obj == 1) {
                item['change_obj'] = '礼品卡'
                card[0].children ? card[0].children.push(item) : card[0].children = [item]
              } else {
                item['change_obj'] = '提货卡'
                card[1].children ? card[1].children.push(item) : card[1].children = [item]
              }
            })
            res.json({
              tickets: arr,
              balance,
              card
            })
          })
        })
      })
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
  }
}

module.exports = userServices