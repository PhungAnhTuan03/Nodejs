// models/Application.js
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  coverLetter: { type: String },
  status: { type: String, enum: ['pending', 'interview', 'accepted', 'rejected'], default: 'pending' },
  appliedDate: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
