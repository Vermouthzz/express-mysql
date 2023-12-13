const db = require('../../config/db.config')
const auth = require('../../utils/auth')

const loginServices = {
  login: ({ account, password }, res) => {
    let sql = 'select account,password,id,pay_word from user where account = ?'
    db.query(sql, [account], (err, result) => {
      if (result.length === 0) {
        res.json({
          status: '404',
          msg: '用户名不存在'
        })
      } else {
        if (result[0].password !== password) {
          res.json({
            status: '404',
            msg: '密码错误'
          })
        } else {
          if (result[0].pay_word != null) {
            result[0].has_payword = true
          } else {
            result[0].has_payword = false
          }
          delete result[0].pay_word
          delete result[0].password
          let ids = result[0].id
          let sqls = 'select * from userinfo where u_id = ?'
          const token = auth.generateToken({ id: ids })
          db.query(sqls, [ids], (err, results) => {
            let res1 = Object.assign(result[0], results[0])
            res1.token = token
            res.json({
              data: res1,
              status: '200',
              msg: '登录成功',
            })
          })
        }
      }
    })
  },
  register: ({ account, password }, res) => {
    account = '2238'
    password = '1234'
    let sql = 'select account,password from user where account = ?'
    let insertSql = 'insert into user(account,password) values(?,?)'
    db.query(sql, [account], (err, result) => {
      if (result.length !== 0) {
        res.json({
          status: '402',
          msg: '用户名已存在'
        })
      } else {
        db.query(insertSql, [account, password], (err, result) => {
          console.log(result);
          if (result.affectedRows !== 0) {
            res.json({
              status: '200',
              msg: '注册成功'
            })
          } else {
            res.json({
              status: '404',
              msg: '注册失败'
            })
          }
        })
      }
    })
  }
}

module.exports = loginServices