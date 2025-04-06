// controllers/applicationController.js
const applicationService = require('../service/applicationService');

// Tạo mới đơn ứng tuyển
exports.createApplication = async (req, res) => {
    try {
        const applicationData = req.body;
        const application = await applicationService.createApplication(applicationData);
        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lấy thông tin đơn ứng tuyển theo id
exports.getApplication = async (req, res) => {
    try {
        const application = await applicationService.getApplicationById(req.params.id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
        res.status(200).json(application);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cập nhật đơn ứng tuyển (ví dụ: thay đổi trạng thái)
exports.updateApplication = async (req, res) => {
    try {
        const updatedApplication = await applicationService.updateApplication(req.params.id, req.body);
        if (!updatedApplication) {
            return res.status(404).json({ message: 'Application not found' });
        }
        res.status(200).json(updatedApplication);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Xóa đơn ứng tuyển
exports.deleteApplication = async (req, res) => {
    try {
        const deletedApplication = await applicationService.deleteApplication(req.params.id);
        if (!deletedApplication) {
            return res.status(404).json({ message: 'Application not found' });
        }
        res.status(200).json({ message: 'Application deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lấy danh sách tất cả đươn ứng tuyển
exports.getAllApplications = async (req, res) => {
    try {
        const application = await applicationService.getAllApplications();
        res.status(200).json(application);
    } catch (error) {
        console.error('Error fetching application:', error);
        res.status(500).json({ error: error.message });
    }
};