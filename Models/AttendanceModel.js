const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    subject: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['Present', 'Absent', 'Leave'], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Attendance', AttendanceSchema);
