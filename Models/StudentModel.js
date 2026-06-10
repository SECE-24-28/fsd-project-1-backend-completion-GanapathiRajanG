const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    department: { type: String, default: 'Computer Science' },
    semester: { type: Number, default: 1 },
    program: { type: String, default: 'B.Tech' },
    status: { type: String, default: 'Active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', StudentSchema);
