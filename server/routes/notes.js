const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Note = require('../models/Note');
const Vote = require('../models/Vote');
const { protect } = require('../middleware/auth');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary Storage Config
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'notes_exchange', // Folder name in Cloudinary
    resource_type: 'auto',    // Important: Allows both images and raw files (PDFs)
    allowed_formats: ['pdf', 'jpg', 'png', 'jpeg', 'webp'],
  },
});

// File filter — only PDF and images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and image files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

// @route   GET /api/notes
// @desc    Get all notes with optional filters & search
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { semester, branch, subject, search, page = 1, limit = 12 } = req.query;
    const query = {};

    if (semester) query.semester = semester;
    if (branch) query.branch = branch;
    if (subject) query.subject = { $regex: subject, $options: 'i' };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { subjectCode: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Note.countDocuments(query);

    const notes = await Note.find(query)
      .populate('uploadedBy', 'name email')
      .sort({ upvotes: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      notes,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   GET /api/notes/:id
// @desc    Get single note by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).populate('uploadedBy', 'name email');
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   POST /api/notes
// @desc    Upload a new note
// @access  Protected
router.post('/', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const { title, subject, subjectCode, semester, branch } = req.body;

    if (!title || !subject || !semester || !branch) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const isPdf = req.file.mimetype === 'application/pdf';

    const note = await Note.create({
      title,
      subject,
      subjectCode: subjectCode || '',
      semester,
      branch,
      fileUrl: req.file.path,
      cloudinaryId: req.file.filename,
      fileType: isPdf ? 'pdf' : 'image',
      originalName: req.file.originalname,
      uploadedBy: req.user._id,
    });

    const populated = await note.populate('uploadedBy', 'name email');
    res.status(201).json({ message: 'Note uploaded successfully', note: populated });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   DELETE /api/notes/:id
// @desc    Delete a note (only by owner)
// @access  Protected
router.delete('/:id', protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    if (note.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this note' });
    }

    // Delete file from Cloudinary
    if (note.cloudinaryId) {
      await cloudinary.uploader.destroy(note.cloudinaryId, {
        resource_type: note.fileType === 'pdf' ? 'raw' : 'image'
      });
    }

    await note.deleteOne();
    await Vote.deleteMany({ noteId: req.params.id });

    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
