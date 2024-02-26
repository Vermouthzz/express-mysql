const db = require('../../config/db.config')
let arr = []

const categoryServices = {
  getCategoryList: async (req, res) => {
    const { id } = req.query
    try {
      let sql = 'SELECT category_name,category_id from goods_category WHERE level = 0'
      let sqlChildren = 'SELECT category_name,category_id,parent_id FROM goods_category WHERE parent_id = ?'
      let sqlChildrens = 'SELECT category_name,category_id,parent_id,img_url FROM goods_category WHERE parent_id = ?'
      //一级分类标签
      if (!arr.length) {
        const data = await db.executeQuery(sql)
        arr = data
      }
      const childrenRes = await db.executeQuery(sqlChildren, [id])
      let promise = []
      childrenRes.flat().forEach(items => {
        let parentId = items.category_id
        promise.push(db.executeQuery(sqlChildrens, [parentId]))
      })
      const childrenResult = (await Promise.all(promise)).flat()
      childrenRes.forEach(item => {
        childrenResult.forEach(subItem => {
          if (subItem.parent_id == item.category_id) {
            item.children ? item.children.push(subItem) : item.children = []
          }
        })
      })
      res.json({
        msg: 'success',
        result: {
          cateList: childrenRes,
          asideList: arr
        }
      })
    } catch (error) {

    }
  },
  getSecondCate: async (req, res) => {
    let { id, parent_id } = req.query
    try {
      let sql_name = 'select category_name,category_id from goods_category where parent_id = ?'
      let sqls = 'select category_name,category_id from goods_category where category_id = ?'
      let allCate = []
      if (parent_id != -1) {
        const cateArr = await db.executeQuery(sql_name, [parent_id])
        let promise = []
        cateArr.forEach(item => {
          promise.push(db.executeQuery(sql_name, [item.category_id]))
        })
        allCate = (await (Promise.all(promise))).flat()
      }
      let sql = 'select goods_id,category_id,goods_name,goods_img,goods_price from goods where category_id=?'
      const goodsData = await db.executeQuery(sql, [id])

      const [name] = await db.executeQuery(sqls, [id])

      res.json({
        result: {
          secondTitle: name.category_name,
          navList: allCate,
          goodsData
        },
        status: 200,
        msg: '查询成功'
      })
    } catch (error) {

    }
  },
  //根据商品分类id获取商品列表
  getGoodsListAPI: async (req, res) => {
    const { id } = req.query
    try {
      let c_sql = 'select category_name from goods_category where category_id = ?'

      const [{ category_name }] = await db.executeQuery(c_sql, [id])

      let sql = 'select goods_name,goods_id,goods_price,retail_price,goods_img from goods where category_id = ?'

      const data = await db.executeQuery(sql, [id])
      res.json({
        result: {
          name: category_name,
          data
        },
        msg: 'success'
      })
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = categoryServices