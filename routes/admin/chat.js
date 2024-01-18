var express = require('express');
var chatRouter = express.Router();
const chatController = require('../../controllter/admin/chatController')

chatRouter.get('/admin/chatinfo', chatController.getChatInfo)

chatRouter.get('/admin/chat', chatController.getUserChat)

module.exports = chatRouter