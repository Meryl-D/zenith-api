import mongoose from 'mongoose';
const Schema = mongoose.Schema;

//Define a schema for Places
const placesSchema = new Schema({
    url_picture:{
        type: String,
        required: true,
    }, 
    location: {
        type: String,
        required: true,
    },
    description: // Nested array of documents
    {
        type: String,
        date: Date,
        minLenght: 2,
        maxLength: 200,
        required: true,

    },
    publication_date: Date, 
    visit_date: Date,
    modification_date: {
        type: Date,
        default: Date.now
      }
  });
