import express from "express";
import Post from '../database/models/postModel';

const postsRouter = express.Router();

/* GET posts listing. */
postsRouter.get("/", function (req, res, next) {
    Post.find().sort('name').exec(function(err,posts) {
        if (err) {
          return next(err);
        }
        res.send(posts);
      });
});

/* GET comments listing for a post */
postsRouter.get("/:id/comments", function (req, res, next) {
    res.send('Comments');
});

/* POST new post */
postsRouter.post('/', function(req, res, next) {
    // Create a new document from the JSON in the request body
    const newPost = new Post(req.body);
    // Save that document
    newPost.save(function(err, savedPost) {
      if (err) {
        return next(err);
      }
      // Send the saved document in the response
      res.send(savedPost);
    });
  });

postsRouter.put("/:id", function (req, res, next) {
    res.send('Update post');
});

postsRouter.delete("/:id", function (req, res, next){
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

export default router;
