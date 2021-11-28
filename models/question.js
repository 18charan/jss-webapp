const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    questionNumber: Number,
    subQuestions: Boolean,
    headerId: Schema.Types.ObjectId,
    questionText: String,
    questionType: String
});

module.exports = mongoose.model('Question', questionSchema);;