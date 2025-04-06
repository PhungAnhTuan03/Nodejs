// apps/service/userService.js
const User = require('../models/User');
const Candidate = require('../models/Candidate');
const Employer = require('../models/Employer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Ví dụ: SECRET_KEY nên được lưu trong file .env
const SECRET_KEY = process.env.JWT_SECRET || 'secret_key_example';

// Đăng ký người dùng
exports.registerUser = async (userData) => {
    const { username, email, password, role } = userData;

    // Kiểm tra user đã tồn tại hay chưa
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
        throw new Error('Email hoặc Username đã tồn tại');
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
        role: role || 'candidate', // giá trị mặc định
    });

    await newUser.save();
    // Tạo record tương ứng trong Candidate hoặc Employer
    if (newUser.role === 'candidate') {
        const newCandidate = new Candidate({
            user: newUser._id,
            fullName: userData.fullName || '',
            dob: userData.dob || null,
            address: userData.address || '',
            resume: userData.resume || '',
            skills: userData.skills || [],
            workExperience: userData.workExperience || [],
        });
        await newCandidate.save();
    } else if (newUser.role === 'employer') {
        const newEmployer = new Employer({
            user: newUser._id,
            companyName: userData.companyName || '',
            address: userData.address || '',
            website: userData.website || '',
            description: userData.description || '',
            contactEmail: userData.contactEmail || '',
            logo: userData.logo || '',
        });
        await newEmployer.save();
    };
    return newUser;
};

// Đăng nhập người dùng
exports.loginUser = async (loginData) => {
    const { email, password } = loginData;

    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Email không đúng');
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Mật khẩu không đúng');
    }

    // Tạo JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, SECRET_KEY, {
        expiresIn: '1d',
    });

    return { token, user };
};

// Lấy thông tin user theo ID
exports.getUserById = async (userId) => {
    const user = await User.findById(userId).select('-password'); // ẩn password
    if (!user) {
        throw new Error('Không tìm thấy người dùng');
    }
    return user;
};

// Cập nhật thông tin user
exports.updateUser = async (userId, updateData) => {
    // Nếu có trường password mới => mã hóa
    if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
    }).select('-password'); // ẩn password
    if (!updatedUser) {
        throw new Error('Không tìm thấy người dùng để cập nhật');
    }
    return updatedUser;
};

// Xóa user
exports.deleteUser = async (userId) => {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
        throw new Error('Không tìm thấy người dùng để xóa');
    }
    return deletedUser;
};

exports.getAllUsers = async () => {
    try {
        const user = await User.find().limit(15);
        return user;
    } catch (error) {
        throw new Error('Error fetching jobs: ' + error.message);
    }
};