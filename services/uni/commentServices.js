const db = require('../../config/db.config')

const commentServices = {
  getCommentList: (req, res) => {
    let goods_id = 10005
    let sql = 'select * from goods_comment where goods_id = ?'
    let arr = []
    db.executeQuery(sql, [goods_id]).then((result) => {
      arr = result
      let promise = []
      let sql = 'select nickname,avator,u_id from userinfo where u_id = ?'
      result.forEach(item => {
        promise.push(db.executeQuery(sql, [item.user_id]))
      })
      return Promise.all(promise).then(data => {
        data.flat().forEach(item => {
          arr.forEach(subItem => {
            if(subItem.user_id == item.u_id) {
              Object.assign(subItem,{user_name: item.nickname,user_avator: item.avator})
            }
          })
        })
        res.send(arr)
      })
    }).catch((err) => {

    })
  },
  addCommentItem: (req, res) => {
    let user_id = 1
    let goods_id = 10005
    const time = new Date().toLocaleString()
    let sql = 'insert into goods_comment(user_id,picture,text,date,goods_id) values(?,?,?,?,?)'
  }
}

module.exports = commentServices