const db = require('../../config/db.config')


const searchServices = {
  getSearchResult: async (req, res) => {
    const { name, type, first } = req.query
    try {
      let sql = 'select goods_id,goods_price,retail_price,goods_img,category_id,goods_name,goods_sales from goods where goods_name like ?'
      let list = await db.executeQuery(sql, [`%${name}%`])
      switch (type) {
        case '2':
          list = list.sort((a, b) => a.retail_price - b.retail_price)
          break
        case '3':
          list = list.sort((a, b) => b.retail_price - a.retail_price)
          break
        case '4':
          list = list.sort((a, b) => a.goods_sales - b.goods_sales)
          break
      }
      if (first == 'true') {
        if (list.length > 0) {
          let searchSql = 'insert into `search`(search_text,category_id) values(?,?)'
          const categoryCounts = {};

          list.forEach(item => {
            const categoryId = item.category_id;
            if (categoryCounts[categoryId]) {
              categoryCounts[categoryId]++;
            } else {
              categoryCounts[categoryId] = 1;
            }
          });

          let maxCount = 0;
          let mostCommonCategoryId = null;
          for (const categoryId in categoryCounts) {
            if (categoryCounts[categoryId] > maxCount) {
              maxCount = categoryCounts[categoryId];
              mostCommonCategoryId = categoryId;
            }
          }
          await db.executeQuery(searchSql, [name, time, mostCommonCategoryId])
        } else {
          let searchSql = 'insert into `search`(search_text) values(?)'
          await db.executeQuery(searchSql, [name, time])
        }
      }
      res.status(200).json({
        msg: 'success',
        list,
      })
    } catch (error) {

    }
  },
  getHotSearchCateResult: async (req, res) => {
    try {
      let textSql = `SELECT search_text, COUNT(*) AS occurrence_count
      FROM search
      GROUP BY search_text
      ORDER BY occurrence_count DESC
      LIMIT 10;`
      const hotSearchData = await db.executeQuery(textSql)
      const data = hotSearchData.map(item => item.search_text)

      const cateSql = 'SELECT category_id, COUNT(*) AS cate_count from search group by category_id order by cate_count desc limit 10'
      const hotCate = await db.executeQuery(cateSql)

      let promise = []
      let sql = 'select category_name,category_id,img_url from goods_category where category_id = ?'
      hotCate.forEach(item => promise.push(db.executeQuery(sql, [item.category_id])))
      const cateInfo = (await Promise.all(promise)).flat()

      res.json({
        msg: 'success',
        result: {
          hotSearchList: data,
          hotCateList: cateInfo
        }
      })
    } catch (error) {
      console.log(error);
    }
  }
  // getFuzzyQuery: (req, res) => {
  //   const { name } = req.query

  //   let sql = 'select'
  // }
}


module.exports = searchServices