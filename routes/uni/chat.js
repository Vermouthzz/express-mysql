var express = require('express');
var chatRouter = express.Router();
const chatController = require('../../controllter/uni/chatController')

chatRouter.post('/uni/chat', chatController.insertUserChatInfo)

chatRouter.get('/uni/chat', chatController.getChatHistory)

module.exports = chatRouter