const express = require('express');
const router = express.Router();
const { getAllClasses, createClass, getMyClasses } = require('../controllers/classController');
const { protect, teacherOnly } = require('../middleware/authMiddleware');

router.get('/', getAllClasses);                                  // Public - for register dropdown
router.post('/', protect, teacherOnly, createClass);            // Teacher only
router.get('/my', protect, teacherOnly, getMyClasses);          // Teacher's classes

module.exports = router;
