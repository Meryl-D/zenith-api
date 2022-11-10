import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import User from './userModel.js';

//Define a schema for Places
const postSchema = new Schema({
    urlPicture:{
        type: String,
        required: true,
    }, 
    location: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        minLenght: 2,
        maxLength: 200,
        required: true,
    },
    publicationDate: {
      type: Date,
      default: Date.now
    },
    visitDate: {
      type: Date
    },
    modificationDate: {
        type: Date,
        default: Date.now
    },
    visible: {
      type: Boolean,
      default: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
});

// Create a model
export default mongoose.model('Post', postSchema);