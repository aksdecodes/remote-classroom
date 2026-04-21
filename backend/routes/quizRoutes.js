const express = require('express');
const router = express.Router();
const { createQuiz, getQuizzes, getQuiz, submitQuiz, getResult, deleteQuiz } = require('../controllers/quizController');
const { protect, teacherOnly } = require('../middleware/authMiddleware');

router.get('/', protect, getQuizzes);
router.post('/', protect, teacherOnly, createQuiz);
router.get('/:id', protect, getQuiz);
router.post('/:id/submit', protect, submitQuiz);
router.get('/:id/result', protect, getResult);
router.delete('/:id', protect, teacherOnly, deleteQuiz);

module.exports = router;
