const db = require('../../config/db.config')

const rankServices = {
  getRankListAPI: async (req, res) => {
    const { id } = req.query
    let list = []
    let title = ''
    try {
      //获取热销榜、特惠榜、新品榜、好评榜：其中好评榜和热销榜一样.
      let commSql = 'select goods_id,user_id,text,comment_id from goods_comment where goods_id = ? order by date limit 1'
      let userSql = 'select avator,u_id from userinfo where u_id = ?'
      if (id == 1 || id == 4) {
        id == 1 ? title = '热销榜' : title = '好评榜'
        let sql = `SELECT goods_id, SUM(count) AS total_sales
        FROM order_goods
        GROUP BY goods_id
        ORDER BY total_sales DESC
        limit 10;`
        const goodsId = await db.executeQuery(sql)

        let goodsSql = 'select goods_img,goods_id,goods_name,goods_price,retail_price from goods where goods_id = ?'
        let promise = []
        goodsId.forEach(item => promise.push(db.executeQuery(goodsSql, [item.goods_id])))
        const data = (await Promise.all(promise)).flat()

        // 获取商品评论
        let promises = []
        data.forEach(item => promises.push(db.executeQuery(commSql, [item.goods_id])))
        const commentData = (await Promise.all(promises)).flat()

        //获取用户头像
        let promise_ = []
        commentData.forEach(i => promise_.push(db.executeQuery(userSql, [i.user_id])))
        const userData = (await Promise.all(promise_)).flat()

        data.forEach(item => {
          commentData.forEach(i => {
            if (item.goods_id == i.goods_id) {
              item.comment = i.text
              for (let key in userData) {
                if (userData[key].u_id == i.user_id) {
                  item.avator = userData[key].avator
                }
              }
            }
          })
        })

        list = data
      } else if (id == 3) {
        title = '新品榜'

        let sql = 'select goods_img,goods_id,goods_name,goods_price,retail_price from goods order by add_time desc limit 10'
        const data = await db.executeQuery(sql)

        //获取商品评论
        let promise = []
        data.forEach(item => promise.push(db.executeQuery(commSql, [item.goods_id])))
        let commentData = (await Promise.all(promise)).flat()

        //获取用户头像
        let promises = []
        commentData.forEach(i => promises.push(db.executeQuery(userSql, [i.user_id])))
        const userData = (await Promise.all(promises)).flat()

        data.forEach(item => {
          commentData.forEach(i => {
            if (item.goods_id == i.goods_id) {
              item.comment = i.text
              for (let key in userData) {
                if (userData[key].u_id == i.user_id) {
                  item.avator = userData[key].avator
                }
              }
            }
          })
        })
        list = data
      }
      const otherRank = [
        { name: '床品', id: '2' },
        { name: '宠物生活', id: '4' },
        { name: '男装', id: '12' },
        { name: '乳饮酒水', id: '3' },
        { name: '家庭清洁', id: '5' },
        { name: '母婴亲子', id: '22' },
        { name: '运动旅行', id: '15' },
      ]
      // 获取二级分类id
      let pp = []
      let cate_sql = 'select category_id,parent_id from goods_category where parent_id = ?'
      otherRank.forEach(item => pp.push(db.executeQuery(cate_sql, [item.id])))
      const ids = await Promise.all(pp)

      let listSql = '	SELECT goods_id, SUM(count) AS total_sales FROM order_goods GROUP BY goods_id ORDER BY total_sales DESC'
      const orderList = await db.executeQuery(listSql)

      // let promise_id = []
      let gidSql = 'select goods_id from goods where category_id = ?'
      let gosSql = 'select goods_img from goods where goods_id = ?'

      const promise_id = ids.map(async (idArray, index) => {
        //获取三级分类id
        const cateP = idArray.map(async item => {
          const caIds = await db.executeQuery(cate_sql, [item.category_id])
          const goodsIdPromises = caIds.map(async (caId) => {
            const goodsIds = await db.executeQuery(gidSql, [caId.category_id]);
            let max = 0;
            let id_ = '';
            goodsIds.forEach((subItem) => {
              const findItem = orderList.find(item => item.goods_id === subItem.goods_id);
              if (findItem && findItem.total_sales > max) {
                id_ = findItem.goods_id;
                max = findItem.total_sales;
              }
            });
            return id_;
          });
          const goodsIds = await Promise.all(goodsIdPromises);
          const imgPromises = goodsIds.map(async (goodsId) => {
            const img = await db.executeQuery(gosSql, [goodsId]);
            return img;
          });
          return Promise.all(imgPromises);
        })
        return Promise.all(cateP);
      })
      const imgs = await Promise.all(promise_id)

      res.json({
        msg: 'success',
        result: {
          rank_id: id,
          title,
          list,
          imgs
        }
      })
    } catch (error) {
      console.log(error);
    }
  },
  getSingleRankAPI: async (req, res) => {
    const { id } = req.query
    try {
      const rankMap = {
        '乳饮酒水榜': 3,
        '男装榜': 12,
        '家庭清洁榜': 5,
        '宠物生活榜': 4,
        '床品榜': 2,
        '运动旅行榜': 15,
        '母婴亲子榜': 22
      }
      let sql = 'select category_id from goods_category where parent_id = ?'
      const paIds = await db.executeQuery(sql, [id])
      let promise = []
      paIds.forEach(item => promise.push(db.executeQuery(sql, [item.category_id])))
      const caIds = await Promise.all(promise)

      let promises = []
      let sqls = 'select goods_id,category_id from goods where category_id = ?'
      caIds.flat().forEach(item => promises.push(db.executeQuery(sqls, [item.category_id])))
      const goodsIds = await Promise.all(promises)
      const newGoods = goodsIds.flat()

      let numSql = `SELECT goods_id, SUM(count) AS total_sales
      FROM order_goods
      GROUP BY goods_id
      ORDER BY total_sales DESC;`

      const countId = await db.executeQuery(numSql)
      const arr = []
      for (let i = 0; i < countId.length; i++) {
        for (let j = 0; j < newGoods.length; j++) {
          if (countId[i].goods_id == newGoods[j].goods_id) {
            arr.push(newGoods[j])
          }
          if (arr.length >= 20) break
        }
      }
      let goodsSql = 'select goods_id,goods_img,goods_price,retail_price,goods_name from goods where goods_id = ?'
      let goodsP = []
      arr.forEach(item => goodsP.push(db.executeQuery(goodsSql, [item.goods_id])))
      const goodsData = await Promise.all(goodsP)
      res.json({
        data: goodsIds.flat(),
        countId,
        arr,
        goodsData
      })

    } catch (error) {

    }
  }
}


module.exports = rankServices