const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    overview: { type: String },
    vision: { type: String },
    mission: { type: String },
    objectives: [{ type: String }],
    facultyDetails: [
      {
        name: { type: String, required: true },
        qualification: { type: String },
        experience: { type: String },
        image: { type: String },
      },
    ],
    labs: [
      {
        name: { type: String },
        equipment: [{ type: String }],
      },
    ],
    curriculum: { type: String }, // Can be a link or text
    achievements: [{ type: String }],
    placements: [
      {
        company: { type: String },
        studentsPlaced: { type: Number },
        year: { type: String },
      },
    ],
    gallery: [{ type: String }], // Image paths
  },
  { timestamps: true }
);

module.exports = mongoose.model('Department', DepartmentSchema);
