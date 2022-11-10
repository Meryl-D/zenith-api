import express from 'express';
import Comment from '../database/models/commentModel.js';

const commentsRouter = express.Router();

// Post a new comment
commentsRouter.post('/:id/comments', function (req, res, next) {

  // req.body.userId = req.userId
  req.body.postId = req.params.id;
  req.body.userId = '636a28c0c465e03b87a28ccd'

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


commentsRouter.patch('/:id', async function (req, res, next) {

  req.body.modificationDate = new Date()

  try {
    const updatedComment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true })
    
    if (!updatedComment) return res.status(404).send()
    res.send(updatedComment)
  
  } catch(err) {
    res.status(500).send(err)
  }
})

commentsRouter.delete('/:id', async function (req, res, next) {

  try {
    const DeletedComment = await Comment.findByIdAndDelete(req.params.id)
    res.send("Commentaire supprimé avec succès")
  
  } catch(err) {
    res.status(500).send(err)
  }
})

export default commentsRouter;