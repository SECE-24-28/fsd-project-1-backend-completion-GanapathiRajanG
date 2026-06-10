const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    targetAudience: { type: String, enum: ['All', 'Students', 'Teachers'], default: 'All' },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notice', NoticeSchema);
