const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new Schema({
  categorie_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Categorie", // Refers to the "Categorie" model
    required: true,
  },
  employer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employer", // Refers to the "Employer" model
    required: true,
  },
  citie_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Citie", // Refers to the "Employer" model
    required: true,
  },
 

  
  title: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
},

pay: {
    type: Number,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
