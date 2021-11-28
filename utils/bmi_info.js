module.exports = val => {
    if(val < 18.5)
    return ({
        status: 1,
        info: [
        'You are classified as Underweight.',
        'You should have a healthy, balanced diet.',
        'Eat more frequently.',
        'Gain more weight.'
    ]})
    else if(val >= 18.5 && val <= 22.9)
    return ({
        status: 0,
        info: [
        'Your BMI is Normal.',
        'Continue regular exercise and follow a healthy diet.'
    ]})
    else if(val >= 23 && val <= 24.9)
    return ({
        status: 2, 
        info: [
        'You are classified as overweight.',
        'You should maintain an ideal body weight.',
        'You are advised to control your diet.',
        'You should exercise regularly.'
    ]})
    else
    return ({
        status: 2, 
        info: [
        'You are classified as obese.',
        'You are advised to reduce weight.',
        'You are strictly advised dietary modifications.',
        'Increase your duration of exercise.'
    ]})
}

 



