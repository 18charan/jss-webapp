const express = require('express');
const bcrypt = require('bcrypt');
const user = require('../models/user');
const router = express.Router();

router.post('/verify', (req, res) => {
    let {
        phNo,
        password
    } = req.body;
    phNo = parseInt(phNo);

    user.findOne({
        phNo
    }, (err, foundData) => {
        if (err) {
            console.log(err);
            return res.status(500).send('There was an internal server error');
        }
        if (foundData === null)
            return res.status(200).send('User not found');

        bcrypt.compare(password, foundData.password, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).send('There was an internal server error');
            }
            if (result) {
                res.cookie('patient', foundData._id, {
                    signed: true,
                    maxAge: 3 * 30 * 24 * 60 * 60 * 1000,
                    sameSite: true
                });
                return res.status(200).send('verified');
            } else
                return res.status(200).send('Ph-No and passwords do not match');
        });

    });
});

router.post('/', (req, res) => {
    const _id = req.signedCookies.patient;

    if (!_id)
        return res.redirect('/');

    const phNo = parseInt(req.body.phNo);

    user.findOne({
        phNo
    }, (err, foundData) => {
        if (err) {
            console.log(err);
            return res.status(500).send('There was an internal server error');
        }
        if (foundData.answers.length == 0)
            return res.redirect('/registration')
        else
            return res.redirect('/dashboard');
    });
});

module.exports = router;