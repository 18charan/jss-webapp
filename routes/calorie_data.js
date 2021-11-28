const express = require('express');
const router = express.Router();
const calorie = require('../models/calorie');

router.get('/', (req, res) => {
    if (req.cookies.admin)
        res.render('calorie_data');
    else
        res.redirect('/admin');
});

router.post('/', (req, res) => {
    if (req.cookies.admin) {
        let {
            foodType,
            food,
            measure,
            baseQuantity,
            baseCalories
        } = req.body;
        baseQuantity = parseFloat(baseQuantity);
        baseCalories = parseInt(baseCalories);

        foodType = (foodType.split(',')).map(each => each.trim());
        const newFood = new calorie({
            foodType,
            food,
            measure,
            baseQuantity,
            baseCalories
        });
        newFood.save((err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send('There was an internal server error');
            } else {
                res.status(200).json(result);
            }
        });
    } else
        res.redirect('/admin');
});

module.exports = router;