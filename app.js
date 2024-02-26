var createError = require('http-errors');
const db = require('./config/db.config')
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const auth = require('./utils/auth')
const fs = require('fs')
const { nanoid } = require('nanoid')




var indexRouter = require('./routes/index');
var loginRouter = require('./routes/uni/login');
const Userrouter = require('./routes/uni/user');
const categoryRouter = require('./routes/uni/category')
const homeRouter = require('./routes/uni/home');
const goodsRouter = require('./routes/uni/goods');


var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//后端跨域cors
const cors = require('cors');
const multer = require('multer');

//uni
const cartRouter = require('./routes/uni/cart');
const addressRouter = require('./routes/uni/address');
const orderRouter = require('./routes/uni/order');
const listRouter = require('./routes/uni/list');
const commentRouter = require('./routes/uni/comment');
const searchRouter = require('./routes/uni/search');
const cardRouter = require('./routes/uni/card');
const ticket_quoteRouter = require('./routes/uni/ticket_quote');
const integralRouter = require('./routes/uni/integral');
const chatRouter = require('./routes/uni/chat')
const rankRouter = require('./routes/uni/rank')

//admin
const a_goodsRouter = require('./routes/admin/goods')
const a_loginRouter = require('./routes/admin/login')
const a_chatRouter = require('./routes/admin/chat')
const a_userRouter = require('./routes/admin/user')
const a_ticketRouter = require('./routes/admin/ticket')

//
const upload = multer({ dest: './public/upload' })
app.use(upload.any())
app.use(express.static("./public"))

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')))
app.use('/public/comment', express.static(path.join(__dirname, 'public/comment')))

//admin
app.use('/api', a_goodsRouter)
app.use('/api', a_loginRouter)
app.use('/api', a_chatRouter)
app.use('/api', a_ticketRouter)

//uni
app.use('/', indexRouter);
app.use('/api', loginRouter)
app.use('/api', categoryRouter)
app.use('/api', homeRouter)
app.use('/api', goodsRouter)
app.use('/api', searchRouter)
app.use('/api', chatRouter)
app.use('/api', rankRouter)

app.use('/api/*', auth.verifyToken)

//uni
app.use('/api', ticket_quoteRouter)
app.use('/api', integralRouter)
app.use('/api', cardRouter)
app.use('/api', cartRouter)
app.use('/api', listRouter)
app.use('/api', commentRouter)
app.use('/api', addressRouter)
app.use('/api', Userrouter)
app.use('/api', orderRouter)


//admin
app.use('/api', a_userRouter)

//file与小程序中的name参数要一致
app.post('/api/uni/upload', (req, res) => {
  console.log(req.userinfo);
  const file = req.files
  const id = req.body.id
  let oldName = file[0].filename
  let newName = Buffer.from(file[0].originalname, 'latin1').toString('utf-8')
  fs.renameSync(`./public/upload/${oldName}`, `./public/upload/${newName}`)
  const avator = `http://127.0.0.1:3000/upload/${newName}`
  let updateSql = 'update userinfo set avator = ? where u_id = ?'
  db.query(updateSql, [avator, id], (err, result) => {
    if (result.affectedRows === 1) {
      res.json({
        status: '200',
        msg: '更换成功',
        avator
      })
    }
  })
})

app.post('/api/uni/comment', async (req, res) => {
  const file = req.files
  const user_id = req.userinfo.id
  const { star, text, date, goods_id, id } = req.body
  let oldName = file[0].filename
  let newName = Buffer.from(file[0].originalname, 'latin1').toString('utf-8')
  fs.renameSync(`./public/upload/${oldName}`, `./public/upload/${newName}`)
  const img = `http://127.0.0.1:3000/upload/${newName}`
  try {
    let comment_id = ''
    if (id == 'none') {
      comment_id = nanoid(8)
      let sql = 'insert into goods_comment(comment_id,user_id,picture,text,date,goods_id,star) values(?,?,?,?,?,?,?)'
      await db.executeQuery(sql, [comment_id, user_id, img, text, date, goods_id, star])

    } else {
      comment_id = id
      let sql = 'update goods_comment set picture = ? where comment_id = ?'
      let selectSql = 'select picture,comment_id from goods_comment where comment_id = ?'
      const [data] = await db.executeQuery(selectSql, [comment_id])
      console.log(data);
      const picture = `${data.picture},${img}`
      await db.executeQuery(sql, [picture, comment_id])
    }

    res.json({
      msg: 'success',
      id: comment_id
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal Server Error.' })
  }
},)









// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
