// update fitur beasiswa
const express = require('express');
const router = express.Router();

const scholarshipController = require('../controllers/scholarshipController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/', authMiddleware, scholarshipController.getAllScholarships);
router.get('/:id', authMiddleware, scholarshipController.getScholarshipById);
router.post('/', authMiddleware, adminMiddleware, scholarshipController.createScholarship);
router.put('/:id', authMiddleware, adminMiddleware, scholarshipController.updateScholarship);
router.delete('/:id', authMiddleware, adminMiddleware, scholarshipController.deleteScholarship);

module.exports = router;