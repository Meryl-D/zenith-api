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
    creationDate: {
      type: Date,
      default: new Date()
    },
    visitDate: {
      type: Date
    },
    modificationDate: {
        type: Date,
        default: new Date()
    },
    visible: {
      type: Boolean,
      default: false
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
});

// Create a model
export default mongoose.model('Post', postSchema);