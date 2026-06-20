const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        minlength: 3,
        maxlength: 30,
        trim: true
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Invalid email']
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false
    },
   role: {
        type: String,
        enum: ['user', 'admin' , 'manager'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    },

    image: {
        type: String,
        default: 'default.png'
    },

    passwordChangedAt: Date,

    passwordResetToken: String,
    passwordResetExpires: Date

}, {
    timestamps: true
});

// pre save make email lowercase
userSchema.pre('save', function () {
    if (this.email) {
        this.email = this.email.toLowerCase();
    }
})

const user = mongoose.model("User", userSchema);
module.exports = user;