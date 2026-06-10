const mongoose = require('mongoose');

const AdmissionSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    address: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    parentName: { type: String, required: true },
    parentMobile: { type: String, required: true },
    courseSelection: { type: String, required: true },
    academicDetails: { type: String, required: true },
    documents: [{ type: String }], // Array of file paths
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Admission', AdmissionSchema);
