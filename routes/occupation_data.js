const express = require('express');
const router = express.Router();
const occupation = require('../models/occupation');

router.get('/', (req, res) => {
    if (req.cookies.admin)
        res.render('occupation_data');
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
        const newOccupation = new occupation({
            occupation: header,
            score
        });
        newOccupation.save((err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send('There was an internal server error');
            } else {
                res.status(200).send('Successfully updated occupation database');
            }
        });
    } else
        res.redirect('/admin');
});

module.exports = router;