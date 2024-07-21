
const mongoose = require("mongoose");

const categorieSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    desc: {
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



module.exports = mongoose.model('Categorie', categorieSchema);
