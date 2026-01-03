const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true // Good practice to remove whitespace
        },
        username: {
            type: String,
            required: true,
            unique: true, // Usernames should be unique
            trim: true,
            lowercase: true // Store usernames in lowercase for consistency
        },
        email: {
            type: String, // Correct type is String
            required: true,
            unique: true, // Emails must be unique
            trim: true,
            lowercase: true,
            match: [/.+\@.+\..+/, 'Please fill a valid email address'] // Basic email format validation
        },
        password: {
            type: String,
            required: true,
            minlength: 6 // Enforce a minimum password length
        }
    },
    {
        // Automatically adds createdAt and updatedAt fields
        timestamps: true 
    }
);

// Note: Remember to hash the password using bcrypt before saving the user document.
// This logic will go in your user controller or pre-save hook, not in the schema itself.

const User = mongoose.model('User', userSchema);

module.exports = User;