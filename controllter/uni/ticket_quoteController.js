const ticket_quoteServices = require('../../services/uni/ticket_quoteServices')

const ticket_quoteController = {
  getTicketList: (req, res) => {
    ticket_quoteServices.getTicketListAPI(req, res)
  },
  updateTicketStatus: (req, res) => {
    ticket_quoteServices.updateStatusAPI(req, res)
  },
  getExchangeTickets: (req, res) => {
    ticket_quoteServices.getExchangeTicketAPI(req, res)
  },
  getTicket: (req, res) => {
    ticket_quoteServices.getTicketAPI(req, res)
  },
  onExchangeRedTicket: (req, res) => {
    ticket_quoteServices.onExchangeRedTicketAPI(req, res)
  }
}

module.exports = ticket_quoteController