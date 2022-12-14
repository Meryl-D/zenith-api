import express from 'express';
import Comment from '../database/models/commentModel.js';
import { resourceExists } from "./middleware/resourceMiddleware.js";
import { authenticate, authorize } from './middleware/authMiddleware.js';

const commentsRouter = express.Router();

/** UPDATE a comment */
commentsRouter.patch('/:id', resourceExists(Comment), authenticate, authorize, async function (req, res, next) {

  req.body.modificationDate = new Date()

  try {
    const updatedComment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.send(updatedComment)
  
  } catch(err) {
    res.status(500).send(err)
  }
})

/** DELETE a comment */
commentsRouter.delete('/:id', resourceExists(Comment), authenticate, authorize, async function (req, res, next) {

  try {
    const DeletedComment = await Comment.findByIdAndDelete(req.params.id)
    res.send(DeletedComment)
  
  } catch(err) {
    res.status(500).send(err)
  }
})

export default commentsRouter;