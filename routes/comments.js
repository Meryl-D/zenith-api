import express from 'express';
import Comment from '../database/models/commentModel.js';
import resourceExists from "./resourceExists.js";

const commentsRouter = express.Router();

commentsRouter.patch('/:id', resourceExists(Comment), async function (req, res, next) {

  req.body.modificationDate = new Date()

  try {
    const updatedComment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true })
    
    if (!updatedComment) res.status(404).send('Updated comment not found')
    res.send(updatedComment)
  
  } catch(err) {
    res.status(500).send(err)
  }
})

commentsRouter.delete('/:id', resourceExists(Comment), async function (req, res, next) {

  try {
    const DeletedComment = await Comment.findByIdAndDelete(req.params.id)
    res.send("Comment deleted successfully!")
  
  } catch(err) {
    res.status(500).send(err)
  }
})

export default commentsRouter;