const db = require('../../config/db.config')


const chatService = {
  //获取用户聊天列表
  getChatInfoAPI: async (req, res) => {
    const { id: user_id } = req.query
    // const user_id = 1001
    try {
      //获取用户最后一条信息
      let sql = `SELECT t1.*
      FROM chat t1
      JOIN (
          SELECT MAX(chat_time) AS max_chat_time, receiver_id, send_id
          FROM chat
          WHERE receiver_id = 1001
          GROUP BY receiver_id, send_id
      ) t2
      ON t1.chat_time = t2.max_chat_time AND t1.receiver_id = t2.receiver_id AND t1.send_id = t2.send_id
      ORDER BY t1.is_read ASC, t1.chat_time DESC;`
      const lastChatData = await db.executeQuery(sql, [user_id])
      //收集用户id
      const friend = lastChatData.reduce((a, b) => {
        if (!a[b.send_id]) {
          a[b.send_id] = b.send_id
        }
        return a
      }, {})
      //获取用户信息
      let promise = []
      let sql_ = 'select nickname, avator, socket_id from userinfo where socket_id = ?'

      for (let key in friend) {
        promise.push(db.executeQuery(sql_, [key]))
      }
      const userInfo = await Promise.all(promise)

      userInfo.flat().forEach(item => {
        lastChatData.flat().forEach(i => {
          if (i.send_id == item.socket_id) {
            Object.assign(item, { time: i.chat_time, msg: i.message, is_read: i.is_read })
          }
        })
      })

      //获取未读消息数量
      let countSql = `SELECT send_id, COUNT(*) AS unread_count
      FROM chat
      WHERE receiver_id = ? AND is_read = 0
      GROUP BY send_id `

      const countData = await db.executeQuery(countSql, [user_id])

      userInfo.flat().forEach(item => {
        item.count = 0
        countData.forEach(i => {
          if (i.send_id == item.socket_id) {
            item.count = i.unread_count
          }
        })
      })

      // 渲染数据
      res.status(200).json({
        result: userInfo.flat()
      })
    } catch (error) {
    }
  },
  //获取单个用户间的聊天信息
  getUserChatAPI: async (req, res) => {
    const { id: receiver_id, sendid } = req.query
    try {
      let sql = `SELECT *
      FROM chat
      WHERE (send_id = ? AND receiver_id = ?)
         OR (send_id = ? AND receiver_id = ?)
      ORDER BY chat_time;`
      const data = await db.executeQuery(sql, [sendid, receiver_id, receiver_id, sendid])

      res.status(200).json({
        result: data
      })
    } catch (error) {
      console.log(error);
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

module.exports = chatService