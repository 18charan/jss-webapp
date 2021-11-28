const calorie = require('../models/calorie');

module.exports = async callback => {
    const diets = ['Breakfast', 'Lunch', 'Snacks', 'Dinner'],
    dietData = await calorie.find({});

    let dietaryRecall = [];

    diets.forEach(dietType => {
       let foodList = dietData.filter(food => food.foodType.includes(dietType));
       foodList = foodList.map(each => {
           const {_id, food, measure} = each;
           return ({_id, food, measure});
        });
       dietaryRecall.push({dietType, foodList});
    });

    callback(dietaryRecall);
}