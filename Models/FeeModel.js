const mongoose = require('mongoose');

const FeeSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    totalFee: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    pendingBalance: { type: Number, required: true },
    dueDate: { type: Date },
    paymentHistory: [
      {
        amount: { type: Number },
        date: { type: Date, default: Date.now },
        receiptNumber: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Fee', FeeSchema);
