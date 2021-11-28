const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const incomeSchema = new Schema({
    minIncome: Number,
    maxIncome: Number,
    score: Number,
});

module.exports = mongoose.model('Income', incomeSchema);