const db = require('../../config/db.config')

const ticketService = {
  getTicketListAPI: async (req, res) => {
    try {
      let sql = 'select * from red_tickets'
      const data = await db.executeQuery(sql)

      res.status(200).json({
        result: data,
        msg: 'success'
      })
    } catch (error) {

    }
  }
}

module.exports = ticketService