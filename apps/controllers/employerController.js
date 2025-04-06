// controllers/employerController.js
const employerService = require('../service/employerService');

// Tạo mới employer
exports.createEmployer = async (req, res) => {
    try {
        const employerData = req.body;
        const employer = await employerService.createEmployer(employerData);
        res.status(201).json(employer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lấy thông tin employer theo id
exports.getEmployer = async (req, res) => {
    try {
        const employer = await employerService.getEmployerById(req.params.id);
        if (!employer) {
            return res.status(404).json({ message: 'Employer not found' });
        }
        res.status(200).json(employer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cập nhật Employer
exports.updateEmployer = async (req, res) => {
    try {
        const updatedEmployer = await employerService.updateEmployer(req.params.id, req.body);
        if (!updatedEmployer) {
            return res.status(404).json({ message: 'Employer not found' });
        }
        res.status(200).json(updatedEmployer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Xóa Employer
exports.deleteEmployer = async (req, res) => {
    try {
        const deletedEmployer = await employerService.deleteEmployer(req.params.id);
        if (!deletedEmployer) {
            return res.status(404).json({ message: 'Employer not found' });
        }
        res.status(200).json({ message: 'Employer deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
