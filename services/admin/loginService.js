const db = require('../../config/db.config')
const auth = require('../../utils/auth')

const loginService = {
  verifyLoginAPI: async (req, res) => {
    const { account, password } = req.body
    try {
      let sql = 'select account, password, id, role from user where account = ?'
      const data = await db.executeQuery(sql, [account])
      console.log(data);
      //用户名不正确或者不存在
      if (!data.length) {
        return res.status(200).json({
          msg: 'error account',
          code: 404
        })
      }
      if (password == data[0].password) {
        const token = auth.generateToken({ id: data[0].id, role: data[0].role })
        res.status(200).json({
          msg: 'login success',
          code: 200,
          token
        })
      } else {      // 密码错误
        res.status(200).json({
          msg: 'error password',
          code: 400
        })
      }
    } catch (error) {
      console.log(error);
    }
  }
}


module.exports = loginService