const db = require('../../config/db.config')


const brandService = {
  getBrandInfoAPI: async (req, res) => {
    const { pageSize, pageNum } = req.query
    try {
      let sql = 'select * from brand'
      const data = await de.executeQuery(sql)
      
    } catch (error) {

    }
  }
}

module.exports = brandService