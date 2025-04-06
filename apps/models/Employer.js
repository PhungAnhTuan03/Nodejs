// models/Employer.js
const mongoose = require('mongoose');

const employerSchema = new mongoose.Schema({
  user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName:   { type: String, required: true },
  address:       { type: String },
  website:       { type: String },
  description:   { type: String },
  contactEmail:  { type: String },
  logo:          { type: String }, // đường dẫn ảnh
}, { timestamps: true });

module.exports = mongoose.model('Employer', employerSchema);
