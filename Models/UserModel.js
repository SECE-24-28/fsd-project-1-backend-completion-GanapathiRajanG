const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    firstname: { type: String, trim: true, required: true },
    lastname: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true, unique: true, lowercase: true },
    phone: { type: String, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'teacher', 'student'], default: 'student' },
    status: { type: String, enum: ['Active', 'Banned'], default: 'Active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
