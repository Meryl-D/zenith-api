import express from "express";
import Post from '../database/models/postModel.js';
import Comment from '../database/models/commentModel.js';
import resourceExists from "./middleware/resourceMiddleware.js";

const postsRouter = express.Router();

/* GET posts listing. */
postsRouter.get("/", function (req, res, next) {

  let query = Post.find()
  
  query = query.where({visible: true}).or({_id: req.userId})
  query = query.populate('userId')
  query.sort({creationDate: 'desc'})

  query.exec(function (err, posts) {
    if (err) {
      return next(err)
    }
    res.send(posts)
  })
})

/* GET comments listing for a post */
postsRouter.get('/:id/comments', resourceExists(Post), function (req, res, next) {

  let query = Comment.find()

  // Get comments only for the current post
  query = query.where('postId').equals(req.params.id)
  query = query.populate('postId').populate('userId')
  query.sort({creationDate: 'desc'})

  // Execute the query
  query.exec(function (err, comments) {
    if (err) {
      return next(err)
    }
    res.send(comments)
  })
})

/* POST new post */
postsRouter.post('/', function (req, res, next) {

  req.body.userId = req.userId
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
postsRouter.post('/:id/comments', resourceExists(Post), function (req, res, next) {

  req.body.userId = req.userId
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

postsRouter.patch("/:id", function (req, res, next) {
  res.send('Update post');
});

postsRouter.delete("/:id", function (req, res, next) {
  // Profile.findOneAndDelete({ user: req.post.id })
  // .then(() => {
  //     console.log(req.post.id);
  //     Post.findOne({_id: req.post.id }).then(post=>console.log(post));
  //     Post.findOneAndDelete({ _id: req.post.id });
  // })
  // .then(() => {
  //     res.json({ success: true });
  // });
});

export default postsRouter;
