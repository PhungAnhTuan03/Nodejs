// services/applicationService.js
const Application = require('../models/Application');

// Tạo mới đơn ứng tuyển
exports.createApplication = async (applicationData) => {
    const application = new Application(applicationData);
    return await application.save();
};

// Lấy đơn ứng tuyển theo id
exports.getApplicationById = async (id) => {
    return await Application.findById(id);
};

// Cập nhật đơn ứng tuyển theo id
exports.updateApplication = async (id, updateData) => {
    return await Application.findByIdAndUpdate(id, updateData, { new: true });
};

// Xóa đơn ứng tuyển theo id
exports.deleteApplication = async (id) => {
    return await Application.findByIdAndDelete(id);
};

exports.getAllApplications = async () => {
    try {
        const application = await Application.find();
        return application;
    } catch (error) {
        throw new Error('Error fetching application: ' + error.message);
    }
};