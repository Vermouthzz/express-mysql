const chatService = require('../../services/admin/chatService')

const chatController = {
  getChatInfo: (req, res) => {
    chatService.getChatInfoAPI(req, res)
  },
  getUserChat: (req, res) => {
    chatService.getUserChatAPI(req, res)
  }
}

module.exports = chatController