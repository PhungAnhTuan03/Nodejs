// controllers/jobController.js
const jobService = require('../service/jobService');

// Tạo mới công việc
exports.createJob = async (req, res) => {
    try {
        const jobData = req.body;
        const job = await jobService.createJob(jobData);
        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lấy thông tin job theo id
exports.getJob = async (req, res) => {
    try {
        const job = await jobService.getJobById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cập nhật job
exports.updateJob = async (req, res) => {
    try {
        const updatedJob = await jobService.updateJob(req.params.id, req.body);
        if (!updatedJob) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json(updatedJob);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Xóa job
exports.deleteJob = async (req, res) => {
    try {
        const deletedJob = await jobService.deleteJob(req.params.id);
        if (!deletedJob) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lấy danh sách tất cả công việc
exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await jobService.getAllJobs();
        res.status(200).json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ error: error.message });
    }
};