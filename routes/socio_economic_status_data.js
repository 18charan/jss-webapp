const express = require('express');
const router = express.Router();
const socio_economic_status = require('../models/socio_economic_status');

router.get('/', (req, res) => {
    if (req.cookies.admin)
        res.render('socio_economic_status_data');
    else
        res.redirect('/admin');
});

router.post('/', (req, res) => {
    if (req.cookies.admin) {
        let {
            Class,
            value,
            minScore,
            maxScore
        } = req.body;
        minScore = parseInt(minScore);
        maxScore = parseInt(maxScore);
        value = parseInt(value);
        const newStatus = new socio_economic_status({
            class: {
                label: Class,
                    value
            },
            minScore,
            maxScore
        });
        newStatus.save((err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send('There was an internal server error');
            } else {
                res.status(200).send('Successfully updated socio economic status database');
            }
        });
    } else
        res.redirect('/admin');
});

module.exports = router;