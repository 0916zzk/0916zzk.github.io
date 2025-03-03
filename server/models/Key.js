const mongoose = require("mongoose")

let schema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    date: {
        type: mongoose.SchemaTypes.Date,
        default: Date.now
    }
})
module.exports = mongoose.model('Key', schema)