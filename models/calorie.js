const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const calorieSchema = new Schema({
    foodType: [String],
    food: String,
    measure: String,
    baseQuantity: Number,
    baseCalories: Number,
});

module.exports = mongoose.model('Calorie', calorieSchema);