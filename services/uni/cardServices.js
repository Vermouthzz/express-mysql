const db = require('../../config/db.config')


const cardServices = {
  updateCardItem: (req, res) => {

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
    const {type} = req.query
    let sql = 'select card_id from card where user_id = ?'
    db.executeQuery(sql,[user_id]).then(data => {
      let id = data[0].card_id
      let sql = 'select * from card_change where card_id = ?'
      db.executeQuery(sql,[id]).then(data => {
        data = data.filter(item => item.change_obj == type)
        res.status(200).json(({
          data
        }))
      })
    })
  }
}



module.exports = cardServices