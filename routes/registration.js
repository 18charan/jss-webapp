const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const question = require('../models/question');
const optionalAnswerScore = require('../models/optionalAnswerScore');
const user = require('../models/user');
const calculateScore = require('../utils/calculateScore');
const calculateBMI = require('../utils/calculateBMI');
const calculateExcercise = require('../utils/calculateExcercise');
const calculateWaistHipRatio = require('../utils/calculateWaistHipRatio');
const getDietaryRecall = require('../utils/getDietaryRecall');
const calculateCalories = require('../utils/calculateCalories');

router.get('/', (req, res) => {
    const _id = req.signedCookies.patient;
    if (!_id)
        return res.redirect('/');

    user.findById(_id, 'sex', (err, {sex}) => {
        if(err){
            console.log(err);
        }
        question.find({}, '-__v', async (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send('There was an internal server error');
            }
            let subQuestionsList = result.filter(each => each.headerId);
            result = result.filter(each => !(each.headerId)),
                optionalAnswers = await optionalAnswerScore.find({});
            
                function compare(a, b) {
                    if (a.questionNumber < b.questionNumber)
                    return -1;
                    else if(a.questionNumber > b.questionNumber)
                    return 1;
                    return 0;
                }
    
                subQuestionsList = subQuestionsList.map(each => {
                    const Question = {...each._doc};
                    if (each.questionType == 'choice') {
                        let answers = optionalAnswers.filter(answers => answers.questionId.equals(each._id));
                        if (answers.length > 0)
                            Question.answers = answers[0]
                            .scores.map(obj => ({
                                _id: obj._id,
                                answer: obj.answer
                            }));
                    }
                    return Question;
                });
    
            let questions = result.map(each => {
                const Question = {
                    ...each._doc
                };
                if (each.questionType == 'choice') {
                    let answers = optionalAnswers.filter(answers => answers.questionId.equals(each._id));
                    if (answers.length > 0)
                        Question.answers = answers[0]
                        .scores.map(obj => ({
                            _id: obj._id,
                            answer: obj.answer
                        }));
                }
                if (each.subQuestions){
                    Question.subQuestionsList = subQuestionsList.filter(q => each._id.equals(q.headerId));
                    Question.subQuestionsList.sort(compare);
                }   
                return Question;
            });

            questions = questions.filter(q => {
                if(q._id.equals(process.env.FORFEMALESID) && sex == 'Male')
                    return false;
                return true;
            });
            
            questions.sort(compare);
            getDietaryRecall(dietaryRecall => {
                res.setHeader("Content-Security-Policy", "script-src 'self' 'unsafe-inline' https://code.jquery.com https://maxcdn.bootstrapcdn.com");
                return res.render('registration', {
                    questions, dietaryRecall
            });
            });
        });
    });
});

router.post('/', async (req, res) => {
    return res.send('dashboard');

    const toId = mongoose.Types.ObjectId,
    _id = toId(req.signedCookies.patient),
    answers = await optionalAnswerScore.find({});

    let {score} = await user.findById(_id, 'score');

    if (!_id)
        res.redirect('/');

    const {userAnswers, dietaryRecall} = req.body;

    let formattedAnswers = [];

    for (let key in userAnswers){
        console.log(key)
        const questionId = toId(key);
        let answer = {questionId};

        try{
            const answerId = toId(userAnswers[key]);            
            const result = await calculateScore(questionId, answerId);
            delete result._id;
            score += result.score;
            answer = {...answer, ...result};

        } catch(e){
            answer.answer = userAnswers[key];
        }
        formattedAnswers.push(answer);
    }

    let formattedDietaryRecall = [], calories = 0;

    for (let key in dietaryRecall){
        const foodType = dietaryRecall[key];
        let foodList = [];
        for(let subKey in foodType){
            const result = await calculateCalories(subKey, foodType[subKey]);
            calories += result.calories;
            foodList.push(result);
        }
        formattedDietaryRecall.push({foodType: key, foodList});
    }    

    const bmi = await calculateBMI(User._id),
    excercise = await calculateExcercise(User._id),
    ratio = await calculateWaistHipRatio(User._id);
    score += bmi.score + excercise.score + ratio.score;

    const User = await user.findByIdAndUpdate(_id, {
        '$set': {
            'bmi': bmi.bmi,
            'excercise': excercise.excercise,
            'waistToHipRatio': ratio.waistToHipRatio,
            'score': score,
            'answers': formattedAnswers,
            'dietaryRecall': formattedDietaryRecall,
            'calories': calories
        }
    }, {new: true});

    return res.send('dashboard');
});

module.exports = router;