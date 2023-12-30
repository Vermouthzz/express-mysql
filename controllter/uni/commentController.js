const commentServices = require('../../services/uni/commentServices')


const commentController = {
  getCommentData: (req, res) => {
    commentServices.getCommentList(req, res)
  },
  putUserComment: (req, res) => {
    commentServices.addCommentItem(req, res)
  }
}

module.exports = commentController
