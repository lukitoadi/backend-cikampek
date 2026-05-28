const express = require('express');
const router = express.Router();

const articleController = require('../controllers/articleController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/', authMiddleware, articleController.getAllArticles);
router.get('/:id', authMiddleware, articleController.getArticleById);
router.post('/', authMiddleware, adminMiddleware, articleController.createArticle);
router.put('/:id', authMiddleware, adminMiddleware, articleController.updateArticle);
router.delete('/:id', authMiddleware, adminMiddleware, articleController.deleteArticle);

module.exports = router;