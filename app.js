import express from "express";
import logger from "morgan";
import mongoose from 'mongoose';
import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import postsRouter from "./routes/posts.js";
import commentsRouter from "./routes/comments.js";
import authRouter from "./routes/auth.js";
import fs from 'fs';
import yaml from 'js-yaml';
import swaggerUi from 'swagger-ui-express';

mongoose.Promise = Promise;
mongoose.connect(process.env.DATABASE_URL || 'mongodb://127.0.0.1/zenith');

const app = express();
// Parse the OpenAPI document.
const openApiDocument = yaml.load(fs.readFileSync('./openapi.yml'));
// Serve the Swagger UI documentation.
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

// Log requests (except in test mode).
if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter)
app.use("/users", usersRouter)
app.use("/comments", commentsRouter)
app.use("/posts", postsRouter)
app.use("/login", authRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Send the error status
  res.status(err.status || 500).send(err.message)
});



export default app;
