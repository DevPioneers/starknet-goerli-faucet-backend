const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
    id: { type: Number, index: true },
    user: String,
    count: { type: Number, index: true },
    lastTimestampFaucet: { type: Number, index: true },
    lastUpdated: { type: Number, index: true },
}, { timestamps: false })

module.exports = mongoose.model('User', User)
