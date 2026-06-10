const mongoose = require('mongoose');

const MarksSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    semester: { type: Number, required: true },
    subject: { type: String, required: true },
    internalMarks: { type: Number, default: 0 },
    semesterMarks: { type: Number, default: 0 },
    totalMarks: { type: Number, default: 0 },
    grade: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Marks', MarksSchema);
