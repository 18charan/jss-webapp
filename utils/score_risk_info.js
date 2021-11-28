module.exports = val => {
    if(val < 5)
    return({
        status: 0,
        risk: 'LOW RISK',
        info: [
            'Your Risk of diabetic complication is low.',
            'Continue regular exercise.',
            'Follow a healthy diet.',
            'Get your sugar levels checked regularly.'
    ]})
    else if(val >= 5 && val <= 10)
    return ({
        status: 1,
        risk: 'MODERATE RISK',
        info: [
            'Your Risk of diabetic complication is moderate.',
            'You should exercise regularly.',
            'Get your sugar levels checked regularly.',
            'Follow a proper diabetic diet.'
        ]
    })
    else
    return ({
        status: 2,
        risk: 'HIGH RISK',
        info: [
            'You are at high Risk of diabetic complication.',
            'Increase the duration of exercise regularly.',
            'Get your sugar levels checked more often.',
            'Strictly follow a proper diabetic diet.'
        ]
    })
}




