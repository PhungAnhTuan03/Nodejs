const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');
const Job = require('../models/Job');
const { verifyToken, isAdmin, isEmployer, isCandidate } = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const bcrypt = require('bcrypt');
const cacheMiddleware = require('../middleware/cache');

// Admin route
router.get('/admin/users', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const response = await axios.get(`http://localhost:8080/api/users/profile?page=${page}&limit=${limit}`);
        res.render('users/userList', { users: response.data, title: 'Danh sách người dùng' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Lỗi khi tải danh sách người dùng');
    }
});

router.get('admin/jobs', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:8080/api/jobs');
        res.render('jobs/jobList', { jobs: response.data, title: 'Danh sách bài tuyển dụng' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Lỗi khi tải danh sách bài tuyển dụng');
    }
});
// USERS
router.get('/users', async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const response = await axios.get(`http://localhost:8080/api/users/profile?page=${page}&limit=${limit}`);
        res.render('users/userList', { users: response.data, title: 'Danh sách người dùng' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Lỗi khi tải danh sách người dùng');
    }
});

router.get('/users/profile/:id', async (req, res) => {
    const response = await axios.get(`http://localhost:8080/api/users/profile/${req.params.id}`);
    res.render('users/userDetail', { user: response.data, title: 'Thông tin người dùng' });
});

router.get('/users/profile/:id/edit', async (req, res) => {
    const response = await axios.get(`http://localhost:8080/api/users/profile/${req.params.id}`);
    res.render('users/userEdit', { user: response.data, title: 'Chỉnh sửa người dùng' });
});

router.get('/users/register', (req, res) => {
    const success = req.query.success;
    res.render('users/userRegister', {
        title: 'Đăng ký người dùng',
        success: success ? 'Đăng ký thành công! Mời bạn đăng nhập.' : null,
        error: null
    });
});
router.post('/users/register', [
    body('email').isEmail().withMessage('Email không hợp lệ'),
    body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
], async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('users/userRegister', {
                title: 'Đăng ký người dùng',
                error: 'Email đã được sử dụng',
                success: null
            });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, email, password: hashedPassword, role });
        await newUser.save();

        // Sau khi đăng ký thành công, chuyển về trang login kèm thông báo
        res.redirect('/users/login?success=1');
    } catch (err) {
        console.error(err);
        res.render('users/userRegister', {
            title: 'Đăng ký người dùng',
            error: 'Đã có lỗi xảy ra, vui lòng thử lại',
            success: null
        });
    }
});

router.get('/users/login', (req, res) => {
    const successMessage = req.query.success ? 'Đăng ký thành công, vui lòng đăng nhập.' : null;
    res.render('users/userLogin', {
        title: 'Đăng nhập',
        success: successMessage,
        error: null
    });
});

// Route POST xử lý form đăng nhập
router.post('/users/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).render('users/userLogin', {
                title: 'Đăng nhập',
                error: 'Email hoặc mật khẩu sai',
            });
        }
        console.log('User role:', user.role);
        // Tạo token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Lưu token vào cookie
        res.cookie('token', token, { httpOnly: true });

        // Chuyển hướng theo role và render đúng view
        if (user.role === 'admin') {
            return res.render('admin/home', { title: 'Trang quản trị' });
        } else if (user.role === 'employer') {
            return res.render('employers/home', { title: 'Trang nhà tuyển dụng' });
        } else {
            return res.render('candidates/home', { title: 'Trang ứng viên' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).render('users/userLogin', {
            title: 'Đăng nhập',
            error: 'Lỗi máy chủ. Vui lòng thử lại.'
        });
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('token'); // Xóa cookie
    res.redirect('/users/login'); // Chuyển về trang đăng nhập
});

// CANDIDATES
// Candidate routes
router.get('/candidate/jobs', isCandidate, async (req, res) => {
    const response = await axios.get('http://localhost:8080/api/jobs');
    res.render('candidate/jobList', { jobs: response.data, title: 'Danh sách công việc' });
});
router.get('/candidate/apply/:jobId', isCandidate, (req, res) => {
    res.render('candidate/jobApply', { jobId: req.params.jobId, title: 'Ứng tuyển công việc' });
});
router.get('/candidates/:id', async (req, res) => {
    const response = await axios.get(`http://localhost:8080/api/candidates/${req.params.id}`);
    res.render('candidates/candidateDetail', { candidate: response.data, title: 'Thông tin ứng viên' });
});

router.get('/candidates/:id/edit', async (req, res) => {
    const response = await axios.get(`http://localhost:8080/api/candidates/${req.params.id}`);
    res.render('candidates/candidateEdit', { candidate: response.data, title: 'Chỉnh sửa ứng viên' });
});

router.get('/candidates/create', (req, res) => {
    res.render('candidates/candidateCreate', { title: 'Tạo ứng viên mới' });
});

// JOBS
router.get('/jobs/create', (req, res) => {
    res.render('jobs/jobCreate', { title: 'Tạo công việc mới' });
});

router.get('/jobs', async (req, res) => {
    const response = await axios.get('http://localhost:8080/api/jobs');
    res.render('jobs/jobList', { jobs: response.data, title: 'Danh sách công việc' });
});

router.get('/jobs/:id', async (req, res) => {
    const response = await axios.get(`http://localhost:8080/api/jobs/${req.params.id}`);
    res.render('jobs/jobDetail', { job: response.data, title: 'Chi tiết công việc' });
});

router.get('/jobs/:id/edit', async (req, res) => {
    const response = await axios.get(`http://localhost:8080/api/jobs/${req.params.id}`);
    res.render('jobs/jobEdit', { job: response.data, title: 'Chỉnh sửa công việc' });
});



// APPLICATIONS
router.get('/applications', async (req, res) => {
    const response = await axios.get('http://localhost:8080/api/applications');
    res.render('applications/applicationList', { applications: response.data, title: 'Danh sách ứng tuyển' });
});

router.get('/applications/:id', async (req, res) => {
    const response = await axios.get(`http://localhost:8080/api/applications/${req.params.id}`);
    res.render('applications/applicationDetail', { application: response.data, title: 'Chi tiết ứng tuyển' });
});

router.get('/applications/:id/edit', async (req, res) => {
    const response = await axios.get(`http://localhost:8080/api/applications/${req.params.id}`);
    res.render('applications/applicationEdit', { application: response.data, title: 'Chỉnh sửa ứng tuyển' });
});

router.get('/applications/create', (req, res) => {
    res.render('applications/applicationCreate', { title: 'Tạo ứng tuyển mới' });
});

// EMPLOYERS
// Employer route
router.get('/employer/jobs', isEmployer, async (req, res) => {
    const response = await axios.get('http://localhost:8080/api/jobs');
    res.render('employer/jobList', { jobs: response.data, title: 'Danh sách bài tuyển dụng' });
});
router.get('/employers/:id', async (req, res) => {
    const response = await axios.get(`http://localhost:8080/api/employers/${req.params.id}`);
    res.render('employers/employerDetail', { employer: response.data, title: 'Thông tin nhà tuyển dụng' });
});

router.get('/employers/:id/edit', async (req, res) => {
    const response = await axios.get(`http://localhost:8080/api/employers/${req.params.id}`);
    res.render('employers/employerEdit', { employer: response.data, title: 'Chỉnh sửa nhà tuyển dụng' });
});

router.get('/employers/create', (req, res) => {
    res.render('employers/employerCreate', { title: 'Tạo nhà tuyển dụng' });
});

//Router search
router.get('/search', async (req, res) => {
    const { query } = req.query;

    try {
        // Gọi API tìm kiếm (có thể tùy chỉnh endpoint)
        const users = await axios.get(`http://localhost:8080/api/users?search=${query}`);
        const candidates = await axios.get(`http://localhost:8080/api/candidates?search=${query}`);
        const employers = await axios.get(`http://localhost:8080/api/employers?search=${query}`);
        const jobs = await axios.get(`http://localhost:8080/api/jobs?search=${query}`);

        res.render('search', {
            title: 'Kết quả tìm kiếm',
            query,
            users: users.data,
            candidates: candidates.data,
            employers: employers.data,
            jobs: jobs.data,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Lỗi khi tìm kiếm');
    }
});

module.exports = router;
