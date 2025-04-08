// apps/controllers/userController.js
const userService = require('../service/userService');
const User = require('../models/User'); // ← đường dẫn điều chỉnh đúng với project của bạn
const Candidate = require('../models/Candidate');
const Employer = require('../models/Employer');


// Đăng ký
exports.register = async (req, res) => {
    try {
        const newUser = await userService.registerUser(req.body);
        res.status(201).json({
            message: 'Đăng ký thành công',
            user: newUser,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Đăng nhập
exports.login = async (req, res) => {
    try {
        const { token, user } = await userService.loginUser(req.body);

        // Lưu token vào cookie
        res.cookie('token', token, { httpOnly: true });

        // Chuyển hướng về home và báo thành công
        res.redirect('/?login=success');

    } catch (error) {
        res.status(400).render('users/userLogin', {
            title: 'Đăng nhập',
            error: error.message
        });
    }
};
// Lấy thông tin user (dựa trên userId đã xác thực)
exports.getProfile = async (req, res) => {
    try {
        // Lấy thông tin user qua userId đã được xác thực từ middleware
        const user = await userService.getUserById(req.userId); // Sử dụng getUserById

        let profileData;

        if (user.role === 'candidate') {
            profileData = await Candidate.findOne({ user: user._id }).populate('user', '-password');
        } else if (user.role === 'employer') {
            profileData = await Employer.findOne({ user: user._id }).populate('user', '-password');
        } else {
            profileData = user; // Admin
        }

        if (!profileData) {
            return res.status(404).json({ error: 'Không tìm thấy hồ sơ người dùng' });
        }

        res.status(200).json({ profile: profileData });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Cập nhật user
exports.update = async (req, res) => {
    try {
        const updatedUser = await userService.updateUser(req.userId, req.body);
        res.status(200).json({
            message: 'Cập nhật thành công',
            user: updatedUser,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Xóa user
exports.delete = async (req, res) => {
    try {
        await userService.deleteUser(req.userId);
        res.status(200).json({ message: 'Xóa người dùng thành công' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Lấy danh sách tất cả người dùng
exports.getAllUsers = async (req, res) => {
    try {
        const user = await userService.getAllUsers();
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ error: error.message });
    }
};