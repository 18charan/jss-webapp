const express = require('express');
const user = require('../models/user');
const router = express.Router();
const hba1c_info = require('../utils/hba1c_info')
const score_risk_info = require('../utils/score_risk_info')
const excercise_info = require('../utils/excercise_info')
const bmi_info = require('../utils/bmi_info')
const calories_info = require('../utils/calories_info')

router.get('/', async (req, res) => {
    const _id = req.signedCookies.patient;
    if (!_id)
        res.redirect('/');

    user.findById(_id, 'name age phNo excercise bmi score calories answers').exec(async (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('There was an internal server error');
        }
        let {score, excercise, bmi, name, age, phNo, calories, answers} = result
        bmi = parseFloat(bmi.toFixed(1))
        let dashboard_data = {name, age, phNo, calories}
        dashboard_data.score = {
            value: score,
            ...score_risk_info(score)
        }
        dashboard_data.bmi = {
            value: bmi,
            ...bmi_info(bmi)
        }
        dashboard_data.excercise = {
            value: excercise,
            ...excercise_info(excercise)
        }
        dashboard_data.hba1c = hba1c_info(answers)
        dashboard_data.calories = {
            value: calories,
            info: calories_info(answers)
        }

        //return res.json(dashboard_data)

        res.setHeader("Content-Security-Policy", "script-src 'self' 'unsafe-inline' https://code.jquery.com https://maxcdn.bootstrapcdn.com");
        return res.render('dashboard', dashboard_data);
    });
});

module.exports = router;