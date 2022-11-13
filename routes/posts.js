import express from "express";
// import * as fs from 'fs';
import multer from "multer";
import Post from '../database/models/postModel.js';
import Comment from '../database/models/commentModel.js';
import { resourceExists, checkResourceId } from "./middleware/resourceMiddleware.js";
import { upload } from "./middleware/imageMiddleware.js"
import { authenticate, authorize } from './middleware/authMiddleware.js';

const postsRouter = express.Router()
// const upload = multer({ dest: 'uploads/' })

/* GET posts listing. */
postsRouter.get("/", authenticate, function (req, res, next) {

  let query = Post.find()

  // Filter comments that are either the users own or set to visible by others
  query = query.where({ visible: true }).or({ _id: req.userId })
  query = query.populate('userId')
  query.sort({ creationDate: 'desc' })

  query.exec(function (err, posts) {
    if (err) {
      return next(err)
    }
    res.send(posts)
  })
})

/* GET comments listing for a post */
postsRouter.get('/:id/comments', resourceExists(Post), authenticate, function (req, res, next) {

  let query = Comment.find()

  // Filter comments only for the current post
  query = query.where('postId').equals(req.params.id)
  query = query.populate('postId').populate('userId')
  query.sort({ creationDate: 'desc' })

  // Execute the query
  query.exec(function (err, comments) {
    if (err) {
      return next(err)
    }
    res.send(comments)
  })
})

/* POST a new post */
postsRouter.post('/', authenticate, checkResourceId, upload.single('picture'), function (req, res, next) {

  if (req.fileFormatError) return res.send(req.fileFormatError);

  req.body._id = req.resourceId
  req.body.userId = req.currentUserId
  // Create file path
  if (req.file) {
    req.body.picture.url = new URL(`uploads/${req.file.filename}`, import.meta.url)
    req.body.picture.ext = req.ext
  }
  // Create a new document from the JSON in the request body
  const newPost = new Post(req.body)
  // Save that document
  newPost.save(function (err, savedPost) {
    if (err) {
      return next(err)
    }
    // Send the saved document in the response
    res.send(savedPost)
  });
});

/* POST a new comment for a specific post */
postsRouter.post('/:id/comments', resourceExists(Post), authenticate, function (req, res, next) {

  req.body.userId = req.currentUserId
  req.body.postId = req.params.id
  // req.body.userId = '636a28c0c465e03b87a28ccd'

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

postsRouter.patch("/:id", resourceExists(Post), authenticate, authorize, checkResourceId, upload.single('picture'),
  async function (req, res, next) {
    try {
      req.body.modificationDate = new Date()

      if (req.file) {
        req.body.picture.url = new URL(`uploads/${req.file.filename}`, import.meta.url)
        req.body.picture.ext = req.file.ext
      }
      const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true })

      if (!updatedPost) res.status(404).send('Updated post not found')
      res.send(updatedPost)

    } catch (err) {
      res.status(500).send(err)
    }
  });

postsRouter.delete("/:id", resourceExists(Post), authenticate, authorize, async function (req, res, next) {
  try {
    // delete all the comments of the post first
    await Comment.deleteMany({ postId: req.params.id })

    // const picturePath = `./uploads/${}`
    // fs.exists(filePath, function (exists) {
    //   if (exists) fs.unlinkSync(filePath)
    // })
    // then delete the post itself
    const DeletedPost = await Post.findByIdAndDelete(req.params.id)
    res.send(DeletedPost)

  } catch (err) {
    res.status(500).send(err)
  }
});

export default postsRouter;
