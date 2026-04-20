const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 100,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    subjectCode: {
      type: String,
      trim: true,
      uppercase: true,
    },
    semester: {
      type: String,
      required: [true, 'Semester is required'],
      enum: ['1', '2', '3', '4', '5', '6', '7', '8'],
    },
    branch: {
      type: String,
      required: [true, 'Branch is required'],
      enum: ['CSE', 'ECE', 'ME', 'CE', 'IT', 'EEE', 'Other'],
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
    },
    cloudinaryId: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ['pdf', 'image'],
      required: true,
    },
    originalName: {
      type: String,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Virtual for net votes score
noteSchema.virtual('score').get(function () {
  return this.upvotes - this.downvotes;
});

// Text index for search
noteSchema.index({ title: 'text', subject: 'text', subjectCode: 'text' });

module.exports = mongoose.model('Note', noteSchema);
