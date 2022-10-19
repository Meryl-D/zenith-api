import mongoose from 'mongoose';
const Schema = mongoose.Schema;
// Define a schema
const userSchema = new Schema({
    username: {
        type: String, // Type validation
        required: true, // Mandatory
        minlength: [3, 'username is too short'], // Minimum length
        maxlength: [16, 'username is too long'], // Maximum length
        unique: true // Unique
    },
    password: {
        type: String, // Type validation
        required: true, // Mandatory
    },
    registrationDate: { type: Date, required: true, default: Date.now }, // Default value
});

// Create a model
mongoose.model('User', userSchema);