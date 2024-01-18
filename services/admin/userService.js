const db = require('../../config/db.config')


const userService = {
  getUserInfoAPI: async (req, res) => {
    const user_id = req.userinfo.id
    // const role = req.userinfo.role
    try {
      let sql = 'select * from userinfo where u_id = ?'
      const data = await db.executeQuery(sql, [user_id])
      delete data[0].u_id
      res.status(200).json({
        result: data[0]
      })
    } catch (error) {

    }
  },

}

module.exports = userService