import express from 'express';
import Comment from '../database/models/commentModel';

const router = express.Router();
/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find().sort('name').exec(function(err, users) {
    if (err) {
      return next(err);
    }
    res.send(users);
  });
});
export default router;