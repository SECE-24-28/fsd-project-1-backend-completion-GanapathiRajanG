const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    department: { type: String, default: 'Computer Science' },
    timetable: [
      {
        day: String,
        slot1: String,
        slot2: String,
        slot3: String,
        slot4: String,
        slot5: String,
        slot6: String,
        slot7: String,
      },
    ],
    status: { type: String, default: 'Active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Teacher', TeacherSchema);
