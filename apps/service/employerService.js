// services/employerService.js
const Employer = require('../models/Employer');

// Tạo mới employer
exports.createEmployer = async (employerData) => {
    return await employer.create(employerData);
};

// Lấy employer theo id
exports.getEmployerById = async (id) => {
    return await Employer.findById(id);
};

// Cập nhật Employer theo id
exports.updateEmployer = async (id, updateData) => {
    return await Employer.findByIdAndUpdate(id, updateData, { new: true });
};

// Xóa Employer theo id
exports.deleteEmployer = async (id) => {
    return await Employer.findByIdAndDelete(id);
};