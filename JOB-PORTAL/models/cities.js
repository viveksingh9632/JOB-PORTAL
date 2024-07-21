
const mongoose = require("mongoose");

const citieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    countrie_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Countrie", // Refers to the "User" model
        required: true,
      },

    createdAt: {
        type: Date,
        default: Date.now
    }
});



module.exports = mongoose.model('Citie', citieSchema);
