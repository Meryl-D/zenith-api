import express from "express";
import mongoose from "mongoose";
import User from '../database/models/userModel.js';
import Post from '../database/models/postModel.js';
import Comment from '../database/models/commentModel.js';
import bcrypt from "bcrypt";
import { resourceExists } from "./middleware/resourceMiddleware.js";
import { authenticate, authorize } from './middleware/authMiddleware.js';

const usersRouter = express.Router();

// add a user to the database
usersRouter.post("/", function(req, res, next) {
  // create hashedPassword
  const plainPassword = req.body.password;
  const costFactor = 10;
  bcrypt.hash(plainPassword, costFactor, function(err, hashedPassword) {
    if (err) {
      return next(err);
    }
  req.body.password = hashedPassword
    // Create a new document from the JSON in the request body
    const newUser = new User(req.body);
      // Save that document
    newUser.save(function(err, savedUser) {
      if (err) {
        return next(err);
      }
          // Send the saved document in the response
      res.send(savedUser);
    });
  });
});

// Get a user by id 
usersRouter.get("/:id", resourceExists(User), authenticate, function (req, res, next) {
  // add number of posts posted by the user
  User.aggregate([
    {
      $match: { _id: mongoose.Types.ObjectId(req.params.id) }
    },
    {
      $lookup: {
        from: 'posts',
        localField: '_id',
        foreignField: 'userId',
        as: 'postedPosts'
      }
    },
    { 
      $unwind: '$postedPosts'
    },
    {
      $group: {
        _id: '$_id',
        username: { $first: '$username' },
        registrationDate: { $first: '$registrationDate'},
        postedPosts: { $sum: 1 }
      }
    }
  ], function (err, result) {
    if (err) {
      return next(err);
    }
    res.send(result)
  })
});

// modify a user 
usersRouter.patch('/:id', resourceExists(User) , authenticate, authorize, async function (req, res, next) {

  try {
    // Update an entry for a selected user
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    // Send the updated user in the response if the user id is valid
    res.send(updatedUser)
  
  } catch(err) {
    res.status(500).send(err)
  }
})

// delete a user 
usersRouter.delete('/:id', resourceExists(User), authenticate, authorize, async function (req, res, next) {

  try {
    // first find all posts related to the user to delete
    const relatedPosts = await Post.find({ userId: req.params.id })
    // delete all comments related to the posts
    for (const post of relatedPosts) {
      await Comment.deleteMany({postId: post.id})
    }
    // then delete the posts
    await Post.deleteMany({userId: req.params.id})
    // finally delete the user
    const deletedUser = await User.findByIdAndDelete(req.params.id)
    res.send(deletedUser)
  
  } catch(err) {
    res.status(500).send(err)
  }
})

export default usersRouter;
