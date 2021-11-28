const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const optionalAnswerScore = new Schema({
    questionId: Schema.Types.ObjectId,
    scores: [{
        answer: String,
        score: Number
    }]
});

module.exports = mongoose.model('Optional', optionalAnswerScore);