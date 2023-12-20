var express = require('express');
var ticket_quoteRouter = express.Router();
const ticket_quoteController = require('../../controllter/uni/ticket_quoteController')


ticket_quoteRouter.get('/uni/tickets', ticket_quoteController.getTicketList)
ticket_quoteRouter.get('/uni/ticket', ticket_quoteController.getTicket)
ticket_quoteRouter.get('/uni/tickets/sign', ticket_quoteController.getExchangeTickets)
//
ticket_quoteRouter.put('/uni/put/sign', ticket_quoteController.onExchangeRedTicket)


module.exports = ticket_quoteRouter