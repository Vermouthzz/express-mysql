var express = require('express');
var ticketRouter = express.Router();
const ticketController = require('../../controllter/admin/ticketController')

ticketRouter.get('/admin/tickets', ticketController.getTicketList)


module.exports = ticketRouter