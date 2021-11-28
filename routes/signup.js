const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const user = require('../models/user');
const findSocioEconomicClass = require('../utils/findSocioEconomicClass');

router.post('/verify', (req, res) => {
    const phNo = parseInt(req.body.phNo);

    user.findOne({
        phNo
    }, (err, foundData) => {
        if (err) {
            console.log(err);
            return res.status(500).send('There was an internal server error');
        }
        if (foundData === null)
            return res.status(200).send('verified');
        else
            return res.status(200).send('ph-No already in use');
    });
});

router.post('/', (req, res) => {
    const toId = mongoose.Types.ObjectId;
    let {
        name,
        age,
        sex,
        address,
        phNo,
        maritalStatus,
        educationalQualification,
        occupation,
        monthlyIncome,
        religion,
        password
    } = req.body, answers = [];
    age = parseInt(age);
    phNo = parseInt(phNo);
    monthlyIncome = parseInt(monthlyIncome);
    educationalQualification = toId(educationalQualification);
    occupation = toId(occupation);

    bcrypt.hash(password, parseInt(process.env.HASH_SALT_ROUNDS), (err, password) => {
        if (err) {
            console.log(err);
            return res.status(500).send('There was an internal server error');
        }

        let score = 0;

        if (age >= 40 && age <= 49)
            score += 1;
        else if (age >= 50 && age <= 59)
            score += 2;
        else if (age >= 60)
            score += 3;

        if (sex == 'Male')
            score += 1;

        findSocioEconomicClass(occupation, educationalQualification, monthlyIncome, socioEconomicClass => {
            if (socioEconomicClass.class.value == 4 || socioEconomicClass.class.value == 5)
                score += 1;

            const newUser = new user({
                name,
                age,
                sex,
                address,
                phNo,
                maritalStatus,
                educationalQualification,
                occupation,
                monthlyIncome,
                religion,
                socioEconomicClass: socioEconomicClass._id,
                password,
                score,
                answers
            });
            newUser.save((err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send('There was an internal server error');
                }
                res.cookie('patient', result._id, {
                    signed: true,
                    maxAge: 3 * 30 * 24 * 60 * 60 * 1000,
                    sameSite: true
                });
                res.status(200).send('/registration');
            });
        });
    });

});

module.exports = router;