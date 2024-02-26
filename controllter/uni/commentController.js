const commentServices = require('../../services/uni/commentServices')


const commentController = {
  getCommentData: (req, res) => {
    commentServices.getCommentList(req, res)
  },
  addUserComment: (req, res) => {
    commentServices.addCommentItem(req, res)
  },
  getCommentGoods: (req, res) => {
    commentServices.getCommentGoodsAPI(req, res)
  }
}

module.exports = commentController
