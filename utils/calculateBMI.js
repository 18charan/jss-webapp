const user = require('../models/user');
const mongoose = require('mongoose');

module.exports = async _id => {
    const toId = mongoose.Types.ObjectId,
        heightId = toId(process.env.HEIGHTID),
        weightId = toId(process.env.WEIGHTID);

    let {
        answers,
        score
    } = await user.findById(_id, 'answers score');

    const weight = parseFloat(answers.filter(ans => ans.questionId.equals(weightId))[0].answer),
    height = parseFloat(answers.filter(ans => ans.questionId.equals(heightId))[0].answer),
    bmi = weight * 10000 / (height * height);

    if (bmi >= 23 && bmi <= 24.9)
        score += 1;
    else if (bmi >= 25)
        score += 2;

    return ({bmi, score});
}