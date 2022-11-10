import express from 'express';
import Comment from '../database/models/commentModel.js';

const commentsRouter = express.Router();

// function getCurrentDate(req, res, next) {

//   if (err) {
//     return next(err);
//   }
//   req.currentDate = Date.now;
// }

// Post a new comment
commentsRouter.post('/', function (req, res, next) {
  // req.body.postId = req.params.postId;
  req.body.userId = '636a28c0c465e03b87a28ccd';
  req.body.creationDate = Date.now;
  // Create a new document from the JSON in the request body
  const newComment = new Comment(req.body);
  // Save that document
  newComment.save(function (err, savedComment) {
    if (err) {
      return next(err);
    }
    // Send the saved document in the response
    res.send(savedComment);
  });
});

commentsRouter.patch('/:id', function (req, res, next) {

  Comment.findByIdAndUpdate(req.params.id, req.body, { new: true }).then((comment) => {
    if (!comment) return res.status(404).send()
    res.send(comment)

  }).catch((err) => {
    res.status(500).send(err);
  })
})

export default commentsRouter;