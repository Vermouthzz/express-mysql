const db = require('../../config/db.config')

const integralServices = {
  getUserIntegralListAPI: async (req, res) => {
    const user_id = req.userinfo.id
    let sql = 'select sign_date,integral from userinfo where u_id = ?'
    const data = await db.executeQuery(sql, [user_id])
    res.status(200).json({
      result: data[0],
      msg: 'success'
    })
  },
  updateUserIntegralAPI: async (req, res) => {
    const user_id = req.userinfo.id
    const { date, count, sum, type } = req.body
    console.log(date, count, sum);
    try {
      let sql = 'update userinfo set sign_date = ?,integral=? where u_id = ?'
      let sql_ = 'insert into integral_change(change_num,change_time,user_id,change_type) values(?,?,?,?)'
      await db.executeQuery(sql, [date, sum, user_id])

      await db.executeQuery(sql_, [count, date, user_id, type])
      res.status(200).json({
        msg: 'success'
      })
    } catch (error) {
      res.status(500).json({ success: false, message: 'Internal Server Error.' })
    }
  },
  getIntegralChangeAPI: async (req, res) => {
    const user_id = req.userinfo.id
    try {
      let sql = 'select change_num,change_time,change_type from integral_change where user_id = ? order by change_time desc'
      let sql_ = 'select integral from userinfo where u_id = ?'
      const data = await db.executeQuery(sql, [user_id])
      data.forEach(item => item.change_time = new Date(Number(item.change_time)).toLocaleString())
      const integrals = await db.executeQuery(sql_, [user_id])
      res.status(200).json({
        result: data,
        integral: integrals[0].integral,
        msg: 'success'
      })
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Internal Server Error.' })
    }
  }
}

module.exports = integralServices