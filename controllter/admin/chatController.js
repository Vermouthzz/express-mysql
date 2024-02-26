const chatService = require('../../services/admin/chatService')

const chatController = {
  getChatInfo: (req, res) => {
    chatService.getChatInfoAPI(req, res)
  },
  getUserChat: (req, res) => {
    chatService.getUserChatAPI(req, res)
  },
  insertUserChatInfo: (req, res) => {
    chatService.insertUserChatInfoAPI(req, res)
  }
}

module.exports = chatController