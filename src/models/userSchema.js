const mongoose      = require('mongoose');
const Schema        = mongoose.Schema;
const bcrypt        = require('bcryptjs');

const UserSchema    = new Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        validate: [/^([a-zA-Z]){3,24}$/, 'Name can only contain letters.'],
        select: true
    },
    password: {
        type: String,
        required: true,
        validate: [/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!#¤%&()=?\-_^@$€.,*]{6,64}$/, 'Password must be between 6-256 characters in length and contain numbers and lower- and uppercase letters.'],
        select: false
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        min: 5,
        max: 244,
        validate: [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Not valid email address.'],
        select: true
    }
}, { strict: true });

/**
 * Hook for handling changes in password.
 * Is triggered by calls to save().
 */
UserSchema.pre('save', (callback) => {

    // Is password modified.
    if (!this.isModified('password')) return callback();

    // Password has changed.
    bcrypt.genSalt(5, (err, salt) => {

        // If generating salt fails, callback with an error message.
        if (err) return callback(err);

        // Hash the generated salt.
        bcrypt.hash(this.password, salt, null, (err, hash) => {

            // If hashing fails, callback with an error message.
            if (err) return callback(err);

            // Save the password.
            this.password = hash;
            callback();
        });
    });
});

/**
 * Verifies the given password.
 * @param password
 * @param callback
 * @callback (error, boolean)
 */
UserSchema.methods.verifyPassword = (password, callback) => {

    // Compare given password and the one saved into the database.
    bcrypt.compare(password, this.password, (err, isMatch) => {

        // If comparing fails, always return false as an end result.
        if (err) return callback(err, false);

        // Result as a boolean.
        callback(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);