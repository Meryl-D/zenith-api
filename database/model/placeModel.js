import mongoose from 'mongoose';
const Schema = mongoose.Schema;

//Define a schema for Places
const placesSchema = new Schema({
    url_picture: String,
    location: String,
    description: [ // Nested array of documents
      {
        body: String,
        date: Date
      }
    ],
    publication_date: { type: Date, default: Date.now  }, // Default value
    visit_date: Date,
    modification_date: Date,
  });
