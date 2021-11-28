const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const socio_economic_statusSchema = new Schema({
    minScore: Number,
    maxScore: Number,
    class: {
        label: String,
            value: Number
    }
});

module.exports = mongoose.model('Status', socio_economic_statusSchema);