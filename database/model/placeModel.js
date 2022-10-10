import mongoose from 'mongoose';
const Schema = mongoose.Schema;

//Define a schema for Places
const placeSchema = new Schema({
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
    private: {
      type: Boolean,
      default: true
    }
});

// Create a model
mongoose.model('Place', placeSchema);