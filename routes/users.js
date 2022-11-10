import express from "express";
import User from '../database/models/userModel.js';
const usersRouter = express.Router();

usersRouter.get("/", function (req, res, next) {
  res.send("Got a response from the users route");
});

// add a user route
usersRouter.post('/', function(req, res, next) {
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

// Get a user by id route
usersRouter.get("/:id", function (req, res, next) {
  User.findById(req.params.id).exec(function(err, user) {
    if (err) {
      return next(err);
    }
    res.send(user);
  });
});

// modify a user route
usersRouter.put("/:id" /*...*/);

// delete a user route
usersRouter.delete("/:id" /*...*/);

export default usersRouter;
