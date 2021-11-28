const user = require('../models/user');
const mongoose = require('mongoose');

module.exports = async _id => {
    const toId = mongoose.Types.ObjectId,
        daysId = toId(process.env.DAYSID),
        minutesId = toId(process.env.MINUTESID);

        let {
            answers,
            score
        } = await user.findById(_id, 'answers score');

        const days = parseInt(answers.filter(ans => ans.questionId.equals(daysId))[0].answer),
        minutes = parseInt(answers.filter(ans => ans.questionId.equals(minutesId))[0].answer),
        excercise = days * minutes;

    if (excercise < 150)
        score += 1;

    return ({excercise, score});
}