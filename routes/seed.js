const express = require('express');
const router = express.Router();
const question = require('../models/question');
const optionalAnswerScore = require('../models/optionalAnswerScore');

router.get('/questionsSeed', (req, res) => {
    const questionText = 'How long per day? (in minutes)',
        questionNumber = 2,
        headerId = mongoose.Types.ObjectId('6092cff1d2ba5490d426533f'),
        questionType = 'input'
    subQuestions = false;

    const Question = new question({
        questionNumber,
        questionText,
        headerId,
        questionType,
        subQuestions
    });
    Question.save((err, result) => {
        if (err) {
            console.error(err);
        } else {
            res.json(result);
        }
    });

});

router.get('/answersSeed', (req, res) => {
    const questionId = mongoose.Types.ObjectId('6092b6adc184a26ce42c06d5'),
        scores = [{
            answer: 'Yes',
            score: 1
        }, {
            answer: 'No',
            score: 0
        }]

    const answer = new optionalAnswerScore({
        questionId,
        scores
    });
    answer.save((err, result) => {
        if (err) {
            console.log(err);
        }
        return res.json(result);
    });
});

module.export = router;