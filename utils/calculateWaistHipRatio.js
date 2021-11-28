const user = require('../models/user');
const mongoose = require('mongoose');

module.exports = async _id => {
    const toId = mongoose.Types.ObjectId,
        waistId = toId(process.env.WAISTID),
        hipId = toId(process.env.HIPID);

    let {
        answers,
        score,
        gender
    } = await user.findById(_id, 'answers score gender');


    const waistCircumference = parseInt(answers.filter(ans => ans.questionId.equals(waistId))[0].answer),
    hipCircumference = parseInt(answers.filter(ans => ans.questionId.equals(hipId))[0].answer),
    waistToHipRatio = waistCircumference / hipCircumference;

    if (gender == 'Male') {
        if (waistToHipRatio > 1)
            score += 1;
        if (waistCircumference >= 94)
            score += 1;
    } else if (gender == 'Female') {
        if (waistToHipRatio > 0.85)
            score += 1;
        if (waistCircumference >= 80)
            score += 1;
    }

    return ({waistToHipRatio, score});
}