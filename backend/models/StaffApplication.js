const mongoose = require('mongoose');

const staffApplicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Gmail address is required'],
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@gmail\.com$/i, 'Email must be a valid Gmail address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Enter valid 10-digit Indian phone number'],
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
      trim: true,
    },
    experience: {
      type: Number,
      required: [true, 'Experience is required'],
      min: [0, 'Experience cannot be negative'],
      max: [50, 'Experience looks too high'],
    },
    skills: {
      type: String,
      required: [true, 'Skills are required'],
      trim: true,
      maxlength: [500, 'Skills must be 500 characters or less'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: Date,
    staffUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

staffApplicationSchema.index({ email: 1, status: 1 });

module.exports = mongoose.model('StaffApplication', staffApplicationSchema);
