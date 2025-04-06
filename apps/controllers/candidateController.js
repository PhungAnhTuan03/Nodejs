// controllers/candidateController.js
const candidateService = require('../service/candidateService');

// Tạo mới 1 candidate
exports.createCandidate = async (req, res) => {
    try {
        const candidateData = req.body;
        const candidate = await candidateService.createCandidate(candidateData);
        res.status(201).json(candidate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lấy thông tin candidate theo id
exports.getCandidate = async (req, res) => {
    try {
        const candidate = await candidateService.getCandidateById(req.params.id);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        res.status(200).json(candidate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cập nhật candidate
exports.updateCandidate = async (req, res) => {
    try {
        const updatedCandidate = await candidateService.updateCandidate(req.params.id, req.body);
        if (!updatedCandidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        res.status(200).json(updatedCandidate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Xóa candidate
exports.deleteCandidate = async (req, res) => {
    try {
        const deletedCandidate = await candidateService.deleteCandidate(req.params.id);
        if (!deletedCandidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        res.status(200).json({ message: 'Candidate deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
