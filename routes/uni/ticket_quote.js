var express = require('express');
var ticket_quoteRouter = express.Router();
const ticket_quoteController = require('../../controllter/uni/ticket_quoteController')


ticket_quoteRouter.get('/uni/ticket', ticket_quoteController.getTicketList)
ticket_quoteRouter.get('/uni/ticket/sign', ticket_quoteController.getExchangeTickets)


module.exports = ticket_quoteRouter