
const mongoose = require("mongoose");

const countriesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});



module.exports = mongoose.model('Countrie', countriesSchema);
