// models/Candidate.js
const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  user:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName:       { type: String, required: true },
  dob:            { type: Date },
  address:        { type: String },
  resume:         { type: String }, // đường dẫn file hoặc dạng text
  skills:         [String],
  workExperience: [{
    company:    String,
    position:   String,
    startDate:  Date,
    endDate:    Date,
    description:String
  }],
}, { timestamps: true });

module.exports = mongoose.model('Candidate', candidateSchema);
