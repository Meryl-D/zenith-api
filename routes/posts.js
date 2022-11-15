import express from "express";
import * as fs from 'fs';
import multer from "multer";
import User from '../database/models/userModel.js';
import Post from '../database/models/postModel.js';
import Comment from '../database/models/commentModel.js';
import { resourceExists, checkResourceId } from "./middleware/resourceMiddleware.js";
import { upload } from "./middleware/imageMiddleware.js"
import { authenticate, authorize } from './middleware/authMiddleware.js';
import { broadcastMessage } from '../ws.js';

const postsRouter = express.Router()

/* GET posts listing. */
postsRouter.get("/", authenticate, function (req, res, next) {

  let query = Post.find()

  if (req.query?.others) {
    // Show only the users posts
    query = query.where({ userId: req.currentUserId })
  } else {
    // Filter posts that are either the users own or set to visible by others
    query = query.or([{ visible: true }, { userId: req.currentUserId }])
  }
  if (req.query?.from && req.query?.to) {
    const from = new Date(`${req.query.from}T00:00:00`)
    const to = new Date(`${req.query.to}T23:59:59`)
    query = query.where('visitDate').gte(from).lte(to)
  }
  query = query.populate('userId')
  query.sort({ creationDate: 'desc' })

  query.exec(function (err, posts) {
    if (err) {
      return next(err)
    }
    res.send(posts)
  })
})

/* GET a specific post*/
postsRouter.get('/:id', resourceExists(Post), authenticate, function (req, res, next) {

  Comment.find({ postId: req.params.id }).countDocuments(function (err, count) {
    if (err) return next(err)

    let query = Post.findById(req.params.id).populate('userId')

    query.exec(function (err, post) {
      if (err) {
        return next(err)
      }
      res.send({
        post: post,
        totalComments: count
      })
    })

  })
})

/* GET comments by batch (pages)*/
postsRouter.get('/:id/comments', resourceExists(Post), authenticate, function (req, res, next) {

  Comment.find().count(function (err, total) {
    if (err) return next(err)

    let query = Comment.find()

    // Filter comments only for the current post
    query = query.where('postId').equals(req.params.id)
    query = query.populate('userId')
    query.sort({ creationDate: 'desc' })

    // Parse the "page" param (default to 1 if invalid)
    let page = parseInt(req.query.page, 10);
    if (isNaN(page) || page < 1) { page = 1 }
    // Parse the "pageSize" param (default to 10 if invalid)
    let pageSize = parseInt(req.query.pageSize, 3);
    if (isNaN(pageSize) || pageSize < 0 || pageSize > 10) { pageSize = 10 }
    // Apply skip and limit to select the correct page of elements
    query = query.skip((page - 1) * pageSize).limit(pageSize);

    // Execute the query
    query.exec(function (err, comments) {
      if (err) {
        return next(err)
      }
      res.send({
        page: page,
        pageSize: pageSize,
        total: total,
        data: comments
      });
    })
  })
})

/* POST a new post */
postsRouter.post('/', authenticate, checkResourceId, upload.single('picture'), async function (req, res, next) {

  if (req.fileFormatError) return res.send(req.fileFormatError)
  req.body._id = req.resourceId
  req.body.userId = req.currentUserId
  req.body.visitDate = new Date(req.body.visitDate)

  // Create file path
  if (req.file) {
    const ext = req.file.mimetype.split('/')
    req.body.picture = {
      url: new URL(`../uploads/${req.file.filename}`, import.meta.url),
      ext: ext[1]
    }
  }
  const postingUser = await User.findById(req.body.userId);
  if (!postingUser) return res.status(404).send('Creator not found')

  // Create a new document from the JSON in the request body
  const newPost = new Post(req.body)
  // Save that document
  newPost.save(function (err, savedPost) {
    if (err) {
      return next(err)
    }
    // Send the saved document in the response
    res.send(savedPost)
    // Broadcast the new post to all connected clients
    broadcastMessage({ username: postingUser.username, event: 'posted a new post' })
  });

});

/* POST a new comment for a specific post */
postsRouter.post('/:id/comments', resourceExists(Post), authenticate, async function (req, res, next) {

  req.body.userId = req.currentUserId
  req.body.postId = req.params.id
  req.body.visitDate = new Date(req.body.visitDate)

  const postingUser = await User.findById(req.body.userId)
  if (!postingUser) return res.status(404).send('Creator not found')

  // Create a new document from the JSON in the request body
  const newComment = new Comment(req.body);
  // Save that document
  newComment.save(function (err, savedComment) {
    if (err) {
      return next(err);
    }
    // Send the saved document in the response
    res.send(savedComment);

    // Broadcast the new comment to all connected clients
    broadcastMessage({username: postingUser.username, event: 'comented on the post',  post: req.body.postId })
  });
});

postsRouter.patch("/:id", resourceExists(Post), authenticate, authorize, checkResourceId, upload.single('picture'),
  async function (req, res, next) {
    try {
      req.body.modificationDate = new Date()

      if (req.file) {
        const ext = req.file.mimetype.split('/')
        req.body.picture = {
          url: new URL(`../uploads/${req.file.filename}`, import.meta.url),
          ext: ext[1]
        }
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

    // then delete the post itself
    const deletedPost = await Post.findByIdAndDelete(req.params.id)

    // finally delete the posts image
    const filePath = new URL(`../uploads/zenith_${req.params.id}.${deletedPost.picture.ext}`, import.meta.url)
    fs.exists(filePath, function (exists) {
      if (exists) fs.unlinkSync(filePath)
    })

    res.send(deletedPost)

  } catch (err) {
    res.status(500).send(err)
  }
});


export default postsRouter;