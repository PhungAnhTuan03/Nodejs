// services/jobService.js
const Job = require('../models/Job');

// Tạo mới job
exports.createJob = async (jobData) => {
    const job = new Job(jobData);
    return await job.save();
};

// Lấy job theo id
exports.getJobById = async (id) => {
    return await Job.findById(id);
};

// Cập nhật job theo id
exports.updateJob = async (id, updateData) => {
    return await Job.findByIdAndUpdate(id, updateData, { new: true });
};

// Xóa job theo id
exports.deleteJob = async (id) => {
    return await Job.findByIdAndDelete(id);
};

exports.getAllJobs = async () => {
    try {
        const jobs = await Job.find().limit(15);
        return jobs;
    } catch (error) {
        throw new Error('Error fetching jobs: ' + error.message);
    }
};
