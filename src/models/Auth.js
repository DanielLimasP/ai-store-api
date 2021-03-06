const mongoose = require('mongoose')
const { Schema } = mongoose

const AuthSchema = new Schema({
    storeName: {type: String, required: true},
    pin: {type: String, required: true},
    storeCapacity: {type: Number, required: true},
    peopleInside: {type: Number, required: true},
    timestamp: {type: Date, required: true},
    currentDay: {type: Date, required: true},
    maxPeople: {type: Number, required: true}
})

module.exports = mongoose.model('Auth', AuthSchema)