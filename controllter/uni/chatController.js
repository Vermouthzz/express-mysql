const chatServices = require('../../services/uni/chatServices')

const chatController = {
  getChatHistory: (req, res) => {
    chatServices.getChatHistoryAPI(req, res)
  },
  insertUserChatInfo: (req, res) => {
    chatServices.insertUserChatInfoAPI(req, res)
  }
}


module.exports = chatController