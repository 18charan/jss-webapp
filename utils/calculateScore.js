const optionalAnswerScore = require('../models/optionalAnswerScore');

module.exports = async (questionId, answerId) => {
    const answers = await optionalAnswerScore.find({});
    
    let answer = answers.filter(ans => ans.questionId.equals(questionId))[0];
    answer = answer.scores.filter(ans => ans._id.equals(answerId))[0];

    return ({answer: answer.answer, score: answer.score});
};