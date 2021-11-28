const mongoose = require('mongoose');

module.exports = answers => {
    const toId = mongoose.Types.ObjectId,
    heightId = toId(process.env.HEIGHTID),
    height = parseFloat(answers.filter(ans => ans.questionId.equals(heightId))[0].answer) - 100

    return ([
        `If you are categorised as obese/overweight, Energy required = ${height * 20}kcal`,
        `If you are categorised as normal, Energy required = ${height * 30}kcal`,
        `If you are categorised as underweight, Energy required = ${height * 40}kcal`
    ])


}