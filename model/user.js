const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        min: 6
    },
    password: {
        type: String,
        required: true,
        min: 4
    },
    password_confirmation: {
        type: String,
        min: 4
    }
})

module.exports = mongoose.model('User', userSchema)