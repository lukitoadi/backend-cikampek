const express = require('express');
const router = express.Router();

const faqController = require('../controllers/faqController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/', authMiddleware, faqController.getAllFaqs);
router.post('/', authMiddleware, adminMiddleware, faqController.createFaq);
router.put('/:id', authMiddleware, adminMiddleware, faqController.updateFaq);
router.delete('/:id', authMiddleware, adminMiddleware, faqController.deleteFaq);

module.exports = router;