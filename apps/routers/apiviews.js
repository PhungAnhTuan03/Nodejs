const express = require('express');
const router = express.Router();

// Hiển thị trang đăng nhập
router.get('/users/login', (req, res) => {
    res.render('login');  // 'login' là tên của file EJS trong thư mục views
});

// Hiển thị trang đăng ký
router.get('/users/register', (req, res) => {
    res.render('register');  // 'register' là tên của file EJS trong thư mục views
});

router.get('/users/profile', (req, res) => {
    // Giả sử bạn có API hoặc logic để lấy danh sách tất cả người dùng
    res.render('userProfile');
});

// Candidate routes
router.get('/candidates/:id', (req, res) => {
    // Giả sử bạn có API hoặc logic để lấy thông tin candidate theo ID
    res.render('candidateProfile', { candidateId: req.params.id });
});

// Job routes
router.get('/jobs', (req, res) => {
    // Giả sử bạn có API hoặc logic để lấy danh sách công việc
    res.render('jobList');
});

router.get('/jobs/:id', (req, res) => {
    // Giả sử bạn có API hoặc logic để lấy thông tin công việc theo ID
    res.render('jobDetails', { jobId: req.params.id });
});

// Employer routes
router.get('/employers/:id', (req, res) => {
    // Giả sử bạn có API hoặc logic để lấy thông tin nhà tuyển dụng theo ID
    res.render('employerProfile', { employerId: req.params.id });
});
module.exports = router;
