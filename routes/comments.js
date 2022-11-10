import express from 'express';
import Comment from '../database/models/commentModel.js';
import { resourceExists } from "./lib.js";

const commentsRouter = express.Router();

commentsRouter.patch('/:id', async function (req, res, next) {

  if (!await resourceExists(Comment, req.params.id)) return res.status(404).send()
  
  req.body.modificationDate = new Date()

  try {
    const updatedComment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true })
    
    if (!updatedComment) res.status(404).send()
    res.send(updatedComment)
  
  } catch(err) {
    res.status(500).send(err)
  }
})

commentsRouter.delete('/:id', async function (req, res, next) {

  if (!await resourceExists(Comment, req.params.id)) return res.status(404).send()

  try {
    const DeletedComment = await Comment.findByIdAndDelete(req.params.id)
    res.send("Comment deleted successfully!")
  
  } catch(err) {
    res.status(500).send(err)
  }
})

export default commentsRouter;