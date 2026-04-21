const Class = require('../models/Class');

// @desc    Get all classes (for registration dropdown)
// @route   GET /api/classes
// @access  Public
const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find().select('name').populate('teacherId', 'name');
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new class (teacher only)
// @route   POST /api/classes
// @access  Private/Teacher
const createClass = async (req, res) => {
  try {
    const { name } = req.body;

    const classExists = await Class.findOne({ name });
    if (classExists) {
      return res.status(400).json({ message: 'Class already exists' });
    }

    const newClass = await Class.create({
      name,
      teacherId: req.user._id,
    });

    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get teacher's own classes
// @route   GET /api/classes/my
// @access  Private/Teacher
const getMyClasses = async (req, res) => {
  try {
    const classes = await Class.find({ teacherId: req.user._id });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllClasses, createClass, getMyClasses };
