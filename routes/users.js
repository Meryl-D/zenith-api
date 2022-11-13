import express from "express";
import User from '../database/models/userModel.js';
import bcrypt from "bcrypt";
import { resourceExists, checkResourceId } from "./middleware/resourceMiddleware.js";
import { authenticate, authorize } from './middleware/authMiddleware.js';

const usersRouter = express.Router();

usersRouter.get("/", function (req, res, next) {
  res.send("Got a response from the users route");
});

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
usersRouter.get("/:id", function (req, res, next) {
  User.findById(req.params.id).exec(function(err, user) {
    if (err) {
      return next(err);
    }
    res.send(user);
  });
});

// modify a user 
usersRouter.patch('/:id', resourceExists(User) , authenticate, authorize, async function (req, res, next) {

  try {
    // Update an entry for a selected user
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    // Send the updated user in the response if the user id is valid
    if (!updatedUser) res.status(404).send('User not found')
    res.send(updatedUser)
  
  } catch(err) {
    res.status(500).send(err)
  }
})

// delete a user 
usersRouter.delete('/:id', resourceExists(User), authenticate, authorize, async function (req, res, next) {

  try {
    const DeletedUser = await User.findByIdAndDelete(req.params.id)
    res.send(DeletedUser)
  
  } catch(err) {
    res.status(500).send(err)
  }
})

export default usersRouter;
