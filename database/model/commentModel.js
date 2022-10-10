import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Define a schema
const commentSchema = new Schema({
  description: {
    type: String,
    required: true,
    minLength: [2, 'Description is too short'],
    maxLength: 200
  },
  creation_date: {
    type: Date,
    default: Date.now
  },
  modification_date: {
    type: Date,
    default: Date.now
  }
});

// Create a model
mongoose.model('Comment', commentSchema);