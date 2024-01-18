const db = require('../../config/db.config')


const chatService = {
  getChatInfoAPI: async (req, res) => {
    const { id: user_id } = req.query
    try {
      let sql = 'select * from chat where receiver_id = ?'
      const chatData = await db.executeQuery(sql, [user_id])

      const noReadChat = chatData.filter(i => i.is_read == 0)
      //收集用户id
      const friend = chatData.reduce((a, b) => {
        if (!a[b.send_id]) {
          a[b.send_id] = b.send_id
        }
        return a
      }, [])
      //获取用户信息
      let promise = []
      let sql_ = 'select nickname, avator, socket_id from userinfo where socket_id = ?'
      //获取用户最后一条信息
      let promise_ = []
      let sqls = 'select send_id, chat_time, message from chat where send_id = ? and receiver_id = ? and is_read = ? order by chat_time limit 1'
      friend.forEach(i => {
        if (i) {
          promise.push(db.executeQuery(sql_, [i]))
          promise_.push(db.executeQuery(sqls, [i, user_id, 0]))
        }
      })
      const userInfo = await Promise.all(promise)
      const lastChat = await Promise.all(promise_)

      userInfo.flat().forEach(item => {
        lastChat.flat().forEach(i => {
          if (i.send_id == item.socket_id) {
            Object.assign(item, { time: i.chat_time, msg: i.message })
          }
        })
      })

      userInfo.flat().forEach(item => {
        item.count = 0
        noReadChat.forEach(i => {
          if (i.send_id == item.socket_id) {
            item.count++
          }
        })
      })

      res.status(200).json({
        result: userInfo.flat()
      })
    } catch (error) {
    }
  },
  getUserChatAPI: async (req, res) => {
    const { id, sendid } = req.query
    try {
      let sql = 'select chat_id,chat_time,message,is_read from chat where send_id = ? and receiver_id = ? order by chat_time desc'
      const data = await db.executeQuery(sql, [sendid, id])

      res.status(200).json({
        result: data
      })
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = chatService