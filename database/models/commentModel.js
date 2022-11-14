import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import User from './userModel.js';
import Post from './postModel.js'

// Define a schema
const commentSchema = new Schema({
  description: {
    type: String,
    required: true,
    minLength: [2, 'Comment is too short'],
    maxLength: [200, 'Comment cannot exceed 200 characters']
  },
  creationDate: {
    type: Date,
    default : Date.now
  },
  modificationDate: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Post' 
  }
});

// Create a model
export default mongoose.model('Comment', commentSchema);