
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
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
    categorie_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Categorie", // Refers to the "User" model
        required: true,
      },
    
    createdAt: {
        type: Date,
        default: Date.now
    }
});



adminSchema.pre('save', async function(next) {
    const admin = this;
    if (!admin.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(admin.password, salt);
    admin.password = hash;
    next();
  });
module.exports = mongoose.model('Admin', adminSchema);
