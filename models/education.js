const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const educationSchema = new Schema({
    education: String,
    score: Number
});

module.exports = mongoose.model('Education', educationSchema);