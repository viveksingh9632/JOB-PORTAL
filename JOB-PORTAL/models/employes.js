
const mongoose = require("mongoose");

const employeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});




module.exports = mongoose.model('Employe', employeSchema);
