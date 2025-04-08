// routes/api.js
const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

const candidateController = require('../controllers/candidateController');
const jobController = require('../controllers/jobController');
const applicationController = require('../controllers/applicationController');
const employerController = require('../controllers/employerController');

// User routes
router.post('/users/register', userController.register);
router.post('/users/login', userController.login);
router.get('/users/profile', userController.getAllUsers);


// Các route yêu cầu xác thực
router.get('/users/profile/:id', verifyToken, userController.getProfile);
router.put('/users/profile/:id', verifyToken, userController.update);
router.delete('/users/profile/:id', verifyToken, userController.delete);

// Candidate routes
router.post('/candidates', candidateController.createCandidate);
router.get('/candidates/:id', candidateController.getCandidate);
router.put('/candidates/:id', candidateController.updateCandidate);
router.delete('/candidates/:id', candidateController.deleteCandidate);

// Job routes
router.get('/jobs', jobController.getAllJobs)
router.post('/jobs', jobController.createJob);
router.get('/jobs/:id', jobController.getJob);
router.put('/jobs/:id', jobController.updateJob);
router.delete('/jobs/:id', jobController.deleteJob);
// Thêm route tìm kiếm job
router.get('/jobs/search', jobController.searchJobs);

// Application routes
router.get('/applications', verifyToken, applicationController.getAllApplications);
router.post('/applications', applicationController.createApplication);
router.get('/applications/:id', applicationController.getApplication);
router.put('/applications/:id', applicationController.updateApplication);
router.delete('/applications/:id', applicationController.deleteApplication);

// Employer routes
router.post('/employers', employerController.createEmployer);
router.get('/employers/:id', employerController.getEmployer);
router.put('/employers/:id', employerController.updateEmployer);
router.delete('/employers/:id', employerController.deleteEmployer);

module.exports = router;
