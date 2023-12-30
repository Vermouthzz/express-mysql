const db = require('../../config/db.config')

const commentServices = {
  getCommentList: async (req, res) => {
    let goods_id = 10005
    const type = 1  //1为全部
    let sql = 'select * from goods_comment where goods_id = ?'
    let arr = []
    const result = await db.executeQuery(sql, [goods_id])
    arr = result
    let promise = []
    let sqls = 'select nickname,avator,u_id from userinfo where u_id = ?'
    result.forEach(item => {
      promise.push(db.executeQuery(sqls, [item.user_id]))
    })
    const data = await Promise.all(promise)
    data.flat().forEach(item => {
      arr.forEach(subItem => {
        if (subItem.user_id == item.u_id) {
          Object.assign(subItem, { user_name: item.nickname, user_avator: item.avator })
        }
      })
    })
    res.send(arr)
  },
  addCommentItem: async (req, res) => {
    let user_id = 1
    let goods_id = 10005
    try {
      const time = new Date().getTime()
      let sql = 'insert into goods_comment(user_id,picture,text,date,goods_id) values(?,?,?,?,?)'
      await db.executeQuery(sql, [user_id, , , time, goods_id])
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal Server Error.' })
    }
  }
}

module.exports = commentServices