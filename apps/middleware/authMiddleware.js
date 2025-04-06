// apps/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'secret_key_example';

exports.verifyToken = (req, res, next) => {
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
