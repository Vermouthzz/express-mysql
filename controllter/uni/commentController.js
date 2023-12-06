const commentServices = require('../../services/uni/commentServices')


const commentController = {
  getCommentData: (req, res) => {
    commentServices.getCommentList(req, res)
  }
}

module.exports = commentController
  