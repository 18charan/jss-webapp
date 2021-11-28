const express = require('express');
const router = express.Router();
const education = require('../models/education');

router.get('/', (req, res) => {
    if (req.cookies.admin)
        res.render('education_data');
    else
        res.redirect('/admin');
});

router.post('/', (req, res) => {
    if (req.cookies.admin) {
        let {
            header,
            score
        } = req.body;
        score = parseInt(score);
        const newEducation = new education({
            education: header,
            score
        });
        newEducation.save((err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send('There was an internal server error');
            } else {
                res.status(200).send('Successfully updated education database');
            }
        });
    } else
        res.redirect('/admin');
});

module.exports = router;