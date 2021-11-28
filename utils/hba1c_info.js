const mongoose = require('mongoose');
const user = require('../models/user');

module.exports = answers => {
    const toId = mongoose.Types.ObjectId,
    hba1cId = toId(process.env.HBA1CID),
    value = parseFloat(answers.filter(ans => ans.questionId.equals(hba1cId))[0].answer);

    if(value < 5.7)
    return ({status: 0, 
        value, 
        info: ['Normal.', 'You have a controlled diabetic status.']
    })
    else if(value>=5.7 && value<=6.5)
    return ({status: 1, 
        value, 
        info: ['At risk.', 'You have borderline diabetic status.']
    })
    else
    return ({status: 2, 
        value, 
        info: ['High.', 'You have an uncontrolled diabetic status.']
    })
}