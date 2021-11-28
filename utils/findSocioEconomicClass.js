const occupation = require('../models/occupation');
const education = require('../models/education');
const income = require('../models/income');
const socio_economic_status = require('../models/socio_economic_status');

module.exports = async (occ, edu, inc, callback) => {
    try {
        const {
            score: score1
        } = await occupation.findOne({
            _id: occ
        }, '-_id score');
        const {
            score: score2
        } = await education.findOne({
            _id: edu
        });
        const {
            score: score3
        } = await income.findOne({
            minIncome: {
                $lte: inc
            },
            maxIncome: {
                $gte: inc
            }
        }, '-_id score');
        const score = score1 + score2 + score3;
        const status = await socio_economic_status.findOne({
            minScore: {
                $lte: score
            },
            maxScore: {
                $gte: score
            }
        });
        callback(status);
    } catch (err) {
        console.log(err);
        callback(null);
    }
}