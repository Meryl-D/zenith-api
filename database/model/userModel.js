import mongoose from 'mongoose';
const Schema = mongoose.Schema;
// Define a schema
const userSchema = new Schema({
  title: String,
  body: String,
  date: { type: Date, default: Date.now  }, // Default value
  comments: [ // Nested array of documents
    {
      body: String,
      date: Date
    }
  ],
  meta: { // Nested document
    votes: Number,
    favs: Number
  }
});

// Create a model
mongoose.model('User', userSchema);