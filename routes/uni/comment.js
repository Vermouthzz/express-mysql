var express = require('express');
const commentRouter = express.Router();
const commentController = require('../../controllter/uni/commentController')

commentRouter.get('/uni/comment/list', commentController.getCommentData)

// commentRouter.post('/uni/comment', commentController.addUserComment)

commentRouter.get('/uni/comment', commentController.getCommentGoods)


module.exports = commentRouter