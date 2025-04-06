// services/candidateService.js
const Candidate = require('../models/Candidate');

// Tạo mới candidate
exports.createCandidate = async (candidateData) => {
    return await candidate.create(candidateData);
};

// Lấy candidate theo id
exports.getCandidateById = async (id) => {
    return await Candidate.findById(id);
};

// Cập nhật candidate theo id
exports.updateCandidate = async (id, updateData) => {
    return await Candidate.findByIdAndUpdate(id, updateData, { new: true });
};

// Xóa candidate theo id
exports.deleteCandidate = async (id) => {
    return await Candidate.findByIdAndDelete(id);
};
