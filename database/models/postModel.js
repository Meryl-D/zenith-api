import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const User = mongoose.model('User', userSchema);

//Define a schema for Places
const postSchema = new Schema({
    url_picture:{
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
    publication_date: {
      type: Date,
      default: Date.now
    },
    visit_date: {
      type: Date
    },
    modification_date: {
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