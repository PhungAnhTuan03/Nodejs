// models/Job.js
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  employer: { type: mongoose.Schema.Types.ObjectId, ref: 'Employer', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: { type: [String] },
  salary: { type: Number },
  location: { type: String },
  employmentType: { type: String, enum: ['full-time', 'part-time', 'contract', 'internship'] },
  publishedDate: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
