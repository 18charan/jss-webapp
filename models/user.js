const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    age: Number,
    sex: String,
    address: String,
    phNo: Number,
    maritalStatus: String,
    educationalQualification: {
        type: Schema.Types.ObjectId,
        ref: 'Education'
    },
    occupation: {
        type: Schema.Types.ObjectId,
        ref: 'Occupation'
    },
    monthlyIncome: String,
    religion: String,
    socioEconomicClass: {
        type: Schema.Types.ObjectId,
        ref: 'Status'
    },
    password: String,
    excercise: Number,
    bmi: Number,
    waistToHipRatio: Number,
    score: {
        type: Number,
        default: 0
    },
    answers: [{
        _id: {
            id: false
        },
        questionId: Schema.Types.ObjectId,
        answer: String,
        score: Number
    }],
    dietaryRecall: [{
        _id: false,
        foodType: String,
        foodList: [{
            _id: false,
            foodId: Schema.Types.ObjectId,
            quantity: Number,
            calories: Number
        }]
    }],
    calories: {
        type: Number,
        default: 0
    }
});
const User = mongoose.model('User', UserSchema);

module.exports = User;