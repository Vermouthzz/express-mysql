const mysql = require('mysql')

const coon = mysql.createConnection({
  port: 3306,
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'm163.com',
  // connectionLimit: 10,
  multipleStatements: true, // 允许多条sql同时查询
})

coon.executeQuery = (sql, value) => {
  return new Promise((resolve, reject) => {
    coon.query(sql, value, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

coon.connect((err) => {
  console.log('连接数据库成功');
})

module.exports = coon