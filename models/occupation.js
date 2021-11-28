const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const occupationSchema = new Schema({
    occupation: String,
    score: Number,
});

module.exports = mongoose.model('Occupation', occupationSchema);