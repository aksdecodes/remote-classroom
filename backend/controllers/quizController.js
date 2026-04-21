const { Quiz, QuizResult } = require('../models/Quiz');

// @desc    Create quiz (teacher)
// @route   POST /api/quiz
// @access  Private/Teacher
const createQuiz = async (req, res) => {
  try {
    const { title, classId, questions } = req.body;

    if (!questions || questions.length === 0) {
      return res.status(400).json({ message: 'At least one question required' });
    }

    const quiz = await Quiz.create({
      title,
      classId,
      questions,
      createdBy: req.user._id,
    });

    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get quizzes for a class
// @route   GET /api/quiz
// @access  Private
const getQuizzes = async (req, res) => {
  try {
    const classId = req.user.role === 'student' ? req.user.classId : req.query.classId;

    if (!classId) {
      return res.status(400).json({ message: 'classId is required' });
    }

    // For students, hide correctAnswer field
    let quizzes;
    if (req.user.role === 'student') {
      quizzes = await Quiz.find({ classId }).select('-questions.correctAnswer');
    } else {
      quizzes = await Quiz.find({ classId });
    }

    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single quiz (student attempt)
// @route   GET /api/quiz/:id
// @access  Private
const getQuiz = async (req, res) => {
  try {
    let quiz;
    if (req.user.role === 'student') {
      quiz = await Quiz.findById(req.params.id).select('-questions.correctAnswer');
    } else {
      quiz = await Quiz.findById(req.params.id);
    }

    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit quiz answers (student)
// @route   POST /api/quiz/:id/submit
// @access  Private
const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body; // array of chosen option indices

    // Check if already attempted
    const existing = await QuizResult.findOne({
      studentId: req.user._id,
      quizId: req.params.id,
    });
    if (existing) {
      return res.status(400).json({ message: 'You have already attempted this quiz' });
    }

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    // Calculate score
    let score = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) score++;
    });

    const result = await QuizResult.create({
      studentId: req.user._id,
      quizId: req.params.id,
      score,
      total: quiz.questions.length,
      answers,
    });

    res.json({
      score,
      total: quiz.questions.length,
      percentage: Math.round((score / quiz.questions.length) * 100),
      result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student's quiz result
// @route   GET /api/quiz/:id/result
// @access  Private
const getResult = async (req, res) => {
  try {
    const result = await QuizResult.findOne({
      studentId: req.user._id,
      quizId: req.params.id,
    });

    if (!result) return res.status(404).json({ message: 'No result found' });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete quiz (teacher)
// @route   DELETE /api/quiz/:id
// @access  Private/Teacher
const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    await quiz.deleteOne();
    res.json({ message: 'Quiz deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createQuiz, getQuizzes, getQuiz, submitQuiz, getResult, deleteQuiz };
