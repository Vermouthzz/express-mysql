const ticketService = require('../../services/admin/ticketService')

const ticketController = {
  getTicketList: (req, res) => {
    ticketService.getTicketListAPI(req, res)
  }
}


module.exports = ticketController