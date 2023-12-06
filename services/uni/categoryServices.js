const db = require('../../config/db.config')

const categoryServices = {
  getCategoryList: (req, res) => {
    let sql = 'SELECT category_name,category_id from goods_category WHERE level = 0'
    let sqlChildren = 'SELECT category_name,category_id,parent_id FROM goods_category WHERE parent_id = ?'
    let sqlChildrens = 'SELECT category_name,category_id,parent_id,img_url FROM goods_category WHERE parent_id = ?'
    let arr = []
    db.executeQuery(sql).then(data => {
      let promises = []
      arr = data
      data.forEach(item => {
        let parentId = item.category_id;
        promises.push(db.executeQuery(sqlChildren, [parentId]));
      })
      return Promise.all(promises);
    }).then(childrenRes => {
      childrenRes.flat().forEach(item => {
        arr.forEach(i => {
          if (i.category_id === item.parent_id) {
            let obj = {
              name: item.category_name,
              id: item.category_id,
              parentId: item.parent_id,
              parentName: i.category_name
            }
            i.children ? i.children.push(obj) : i.children = [obj]
          }
        })
      })
      let promise = []
      childrenRes.flat().forEach(items => {
        let parentId = items.category_id
        promise.push(db.executeQuery(sqlChildrens, [parentId]))
      })
      return Promise.all(promise)
    }).then(childrenResult => {
      childrenResult.flat().forEach(item => {
        arr.forEach(arrItem => {
          if (!arrItem.children) return
          arrItem.children.forEach(childItem => {
            if (childItem.id === item.parent_id) {
              let obj = {
                name: item.category_name,
                id: item.category_id,
                parentId: item.parent_id,
                parentName: childItem.category_name,
                firParentId: childItem.parentId,
                imgUrl: item.img_url
              }
              !childItem.children ? childItem.children = [obj] : childItem.children.push(obj)
            }
          })
        })
      })
      res.send(arr)
    })
  },
  getSecondCate: (req, res) => {
    let { id, f_parentId } = req.query
    let subSql = 'SELECT category_name,category_id from goods_category WHERE parent_id = ?'
    let sql = 'SELECT category_id from goods_category WHERE parent_id = ?'
    let arr = []
    db.executeQuery(sql, [f_parentId]).then(result => {
      let promise = []
      result.forEach(item => {
        promise.push(db.executeQuery(subSql, [item.category_id]))
      })
      return Promise.all(promise)
    }).then(subResult => {
      // console.log(subResult);
      subResult.flat().forEach(i => {
        arr.push({ name: i.category_name, id: i.category_id })
      })
      let promise = []
      let sql = 'select goods_id,category_id,goods_name,goods_img,goods_price from goods where category_id=?'
      arr.forEach(arrItem => {
        promise.push(db.executeQuery(sql, [arrItem.id]))
      })
      return Promise.all(promise)
    }).then(goodsData => {
      goodsData.flat().forEach(goodsItem => {
        arr.forEach(arrItem => {
          if(arrItem.id === goodsItem.category_id) {
            arrItem.children ? arrItem.children.push(goodsItem) : arrItem.children = [goodsItem]
          }
        })
      })
      res.json({
        result: arr,
        status: 200,
        msg: '查询成功'
      })
    })
  }
}

module.exports = categoryServices