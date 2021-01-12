const mongoose = require('mongoose')

const objectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 2
    },
    description: {
        type: String,
        required: true,
        min: 4
    },
    lost_city: {
        type: String,
        min: 2
    },
    lost_dpt: {
        type: Number,
        min: 1
    },
    author: {
        type: mongoose.Schema.Types.ObjectId, ref: "User"
    }
})

module.exports = mongoose.model('Object', objectSchema)