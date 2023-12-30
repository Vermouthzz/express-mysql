var express = require('express');
const commentRouter = express.Router();
const commentController = require('../../controllter/uni/commentController')

commentRouter.get('/uni/comment', commentController.getCommentData)

commentRouter.put('/uni/comment', commentController.putUserComment)


module.exports = commentRouter