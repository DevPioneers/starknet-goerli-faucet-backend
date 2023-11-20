const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Setting = new Schema({
    lastIndexedBlock: { type: Number, index: true },
}, { timestamps: false })

module.exports = mongoose.model('Setting', Setting)
