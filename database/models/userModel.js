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

// hide password hash to API users
userSchema.set("toJSON", {
    transform: transformJsonUser
 });
 function transformJsonUser(doc, json, options) {
   // Remove the hashed password from the generated JSON.
   delete json.password;
   return json;
 }

// Create a model
export default mongoose.model('User', userSchema);