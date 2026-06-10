const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    course: { type: String, required: true },
    deadline: { type: Date, required: true },
    submissions: [
      {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
        fileUrl: { type: String }, // Path to the uploaded file
        submittedAt: { type: Date, default: Date.now },
        grade: { type: String },
        feedback: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Assignment', AssignmentSchema);
