module.exports = val => {
    if(val < 150)
    return ({
        status: 1, 
        info: [
        'You should exercise more often.',
        'You should exercise for atleast 150 min per week.'
    ]})
    else
    return ({
        status: 0, 
        info: [
        'You are doing a good job.',
        'Continue regular exercise\n(Check risk score or BMI for further modification)'
    ]})
}
