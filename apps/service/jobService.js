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

const redis = require('redis');

// Tạo Redis client
const client = redis.createClient(); // Cấu hình theo yêu cầu nếu dùng Redis trên remote server
client.on('error', (err) => console.log('Redis error: ', err));

// Lắng nghe lỗi Redis
client.on('error', (err) => {
    console.error('Redis error: ', err);
});

exports.searchJobs = async (keyword) => {
    const cacheKey = `jobs:${keyword}`;  // Tạo key cache dựa trên keyword tìm kiếm

    try {
        // Kiểm tra cache trước
        const cachedJobs = await new Promise((resolve, reject) => {
            client.get(cacheKey, (err, data) => {
                if (err) reject(err);
                resolve(data);
            });
        });

        if (cachedJobs) {
            console.log('Lấy dữ liệu từ cache');
            return JSON.parse(cachedJobs);  // Nếu có trong cache, parse và trả về
        }

        // Nếu không có trong cache, thực hiện tìm kiếm công việc từ DB
        console.log('Lấy dữ liệu từ DB');
        const jobs = await Job.find({
            title: { $regex: keyword, $options: 'i' }
        });

        // Lưu kết quả vào cache với TTL (time to live) là 1 giờ (3600 giây)
        await new Promise((resolve, reject) => {
            client.setex(cacheKey, 3600, JSON.stringify(jobs), (err) => {
                if (err) reject(err);
                resolve();
            });
        });

        console.log('Lưu vào cache');
        return jobs;
    } catch (error) {
        throw new Error('Error searching jobs: ' + error.message);
    }
};