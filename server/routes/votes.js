const express = require('express');
const router = express.Router();
const Vote = require('../models/Vote');
const Note = require('../models/Note');
const { protect } = require('../middleware/auth');

// @route   POST /api/votes/:noteId
// @desc    Upvote or downvote a note (toggle logic)
// @access  Protected
router.post('/:noteId', protect, async (req, res) => {
  try {
    const { voteType } = req.body;
    const { noteId } = req.params;
    const userId = req.user._id;

    if (!['upvote', 'downvote'].includes(voteType)) {
      return res.status(400).json({ message: 'Invalid vote type' });
    }

    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    const existingVote = await Vote.findOne({ userId, noteId });

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // Same vote → remove (toggle off)
        if (voteType === 'upvote') note.upvotes = Math.max(0, note.upvotes - 1);
        else note.downvotes = Math.max(0, note.downvotes - 1);

        await existingVote.deleteOne();
        await note.save();
        return res.json({ message: 'Vote removed', note, userVote: null });
      } else {
        // Different vote → switch
        if (voteType === 'upvote') {
          note.upvotes += 1;
          note.downvotes = Math.max(0, note.downvotes - 1);
        } else {
          note.downvotes += 1;
          note.upvotes = Math.max(0, note.upvotes - 1);
        }
        existingVote.voteType = voteType;
        await existingVote.save();
        await note.save();
        return res.json({ message: 'Vote updated', note, userVote: voteType });
      }
    }

    // New vote
    await Vote.create({ userId, noteId, voteType });
    if (voteType === 'upvote') note.upvotes += 1;
    else note.downvotes += 1;
    await note.save();

    res.json({ message: 'Vote recorded', note, userVote: voteType });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// @route   GET /api/votes/:noteId/my
// @desc    Get current user's vote on a note
// @access  Protected
router.get('/:noteId/my', protect, async (req, res) => {
  try {
    const vote = await Vote.findOne({ userId: req.user._id, noteId: req.params.noteId });
    res.json({ userVote: vote ? vote.voteType : null });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
