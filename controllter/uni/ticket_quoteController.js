const ticket_quoteServices = require('../../services/uni/ticket_quoteServices')

const ticket_quoteController = {
  getTicketList: (req, res) => {
    ticket_quoteServices.getTicketListAPI(req, res)
  },
  updateTicketStatus: (req, res) => {
    ticket_quoteServices.updateStatusAPI(req, res)
  }
}

module.exports = ticket_quoteController