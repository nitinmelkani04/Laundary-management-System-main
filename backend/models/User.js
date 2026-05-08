
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: function () {
        return this.role !== 'customer';
      },
      unique: true,
      sparse: true, // allows multiple nulls (customers without email)
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Enter valid 10-digit Indian phone number'],
    },
    password: {
      type: String,
      minlength: 6,
      // not required for customers (they use OTP)
    },
    role: {
      type: String,
      enum: ['admin', 'staff', 'customer'],
      default: 'staff',
    },
    // OTP fields for customer login
    otp: {
      code: String,
      expiresAt: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Hash password before saving (only if password exists and is modified)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate 6-digit OTP
userSchema.methods.generateOTP = function () {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp = {
    code,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
  };
  return code;
};

// Verify OTP
userSchema.methods.verifyOTP = function (code) {
  if (!this.otp || !this.otp.code) return false;
  if (new Date() > this.otp.expiresAt) return false;
  return this.otp.code === code;
};

module.exports = mongoose.model('User', userSchema);
