const Content = require('../models/Content');
const multer = require('multer');
const path = require('path');

// Multer config - store locally (swap with Cloudinary in production)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['application/pdf', 'video/mp4', 'video/webm', 'video/ogg'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and video files are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 100 * 1024 * 1024 } }); // 100MB

// @desc    Upload content (teacher)
// @route   POST /api/content
// @access  Private/Teacher
const uploadContent = async (req, res) => {
  try {
    const { title, type, classId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const content = await Content.create({
      title,
      type,
      fileUrl,
      classId,
      uploadedBy: req.user._id,
    });

    res.status(201).json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get content for student's class
// @route   GET /api/content
// @access  Private
const getContent = async (req, res) => {
  try {
    // Student gets their classId content; teacher gets by query param
    const classId = req.user.role === 'student' ? req.user.classId : req.query.classId;

    if (!classId) {
      return res.status(400).json({ message: 'classId is required' });
    }

    const content = await Content.find({ classId }).sort({ createdAt: -1 });
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete content (teacher)
// @route   DELETE /api/content/:id
// @access  Private/Teacher
const deleteContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) return res.status(404).json({ message: 'Content not found' });

    await content.deleteOne();
    res.json({ message: 'Content removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { upload, uploadContent, getContent, deleteContent };
