const db = require('../../config/db.config')

const chatServices = {
  getChatHistoryAPI: async (req, res) => {
    // const { id: receiver_id, send: send_id } = req.query
    const receiver_id = 1001, send_id = 1003
    try {
      let sqls = 'select avator from userinfo where socket_id = ?'
      const avators = await db.executeQuery(sqls, [receiver_id])

      let sql = 'select chat_id,send_id, chat_time, message, receiver_id,is_read from chat where send_id = ? and receiver_id = ? order by chat_time '
      const sendData = await db.executeQuery(sql, [send_id, receiver_id])

      const receviedData = await db.executeQuery(sql, [receiver_id, send_id])

      const chatinfo = [...sendData, ...receviedData]

      chatinfo.sort((a, b) => a.chat_time - b.chat_time)

      let idx = 0
      const arr = chatinfo.reduce((preVal, item, index, arr) => {
        if (item.send_id == receiver_id) {
          item.avator = avators[0].avator
        }
        if (index != 0 && item.chat_time - arr[index - 1].chat_time > 1000 * 60 * 60) {
          preVal.push(arr.slice(idx, index))
          idx = index
        }
        return preVal
      }, [])
      arr.push(chatinfo.slice(idx))
      res.status(200).json({
        result: chatinfo,
      })
    } catch (error) {

    }
  },
  insertUserChatInfoAPI: async (req, res) => {
    const { receiver_id, send_id, chat_time, message, is_read } = req.body
    try {
      let sql = 'insert into chat(chat_time,message,send_id,receiver_id,is_read) values(?,?,?,?,?)'
      await db.executeQuery(sql, [chat_time, message, send_id, receiver_id, is_read])

      res.status(200).json({
        msg: 'success'
      })
    } catch (error) {

    }
  }
}


module.exports = chatServices