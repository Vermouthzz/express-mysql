const db = require('../../config/db.config')


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



module.exports = cardServices