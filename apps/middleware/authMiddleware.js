// apps/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'secret_key_example';
const User = require('../models/User');

const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization; // 'Bearer token...'
        if (!authHeader) {
            return res.status(401).json({ error: 'Thiếu header Authorization' });
        }

        const token = authHeader.split(' ')[1]; // cắt chuỗi 'Bearer '
        if (!token) {
            return res.status(401).json({ error: 'Token không hợp lệ' });
        }

        const decoded = jwt.verify(token, SECRET_KEY);
        req.userId = decoded.userId; // Gán userId vào request
        req.userRole = decoded.role; // Gán role (nếu muốn phân quyền)
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token không hợp lệ' });
    }
};

// Middleware kiểm tra quyền truy cập
function isAdmin(req, res, next) {
    const user = req.user; // Giả sử bạn đã lưu thông tin user trong `req.user`
    if (user && user.role === 'admin') {
        return next();
    }
    res.status(403).send('Bạn không có quyền truy cập trang này');
}

function isEmployer(req, res, next) {
    const user = req.user;
    if (user && user.role === 'employer') {
        return next();
    }
    res.status(403).send('Bạn không có quyền truy cập trang này');
}

function isCandidate(req, res, next) {
    const user = req.user;
    if (user && user.role === 'candidate') {
        return next();
    }
    res.status(403).send('Bạn không có quyền truy cập trang này');
}

module.exports = {
    verifyToken,
    isAdmin,
    isEmployer,
    isCandidate
};