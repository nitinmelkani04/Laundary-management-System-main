
// const express = require('express');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const { protect, adminOnly } = require('../middleware/auth');
// const { sendOtpSms } = require('../config/sms');

// const router = express.Router();

// const generateToken = (id) =>
//   jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// // ═══════════════════════════════════════════════════════
// //  1. ADMIN SETUP  →  POST /api/auth/register-admin
// //     - Sirf ek baar kaam karta hai
// //     - ADMIN_SECRET banana padta hai .env se
// //     - Agar admin already exist karta hai → reject
// // ═══════════════════════════════════════════════════════
// router.post('/register-admin', async (req, res, next) => {
//   try {
//     const { name, email, password, adminSecret } = req.body;

//     // Secret check
//     if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
//       return res.status(403).json({
//         success: false,
//         message: 'Invalid admin secret key.',
//       });
//     }

//     // Only 1 admin allowed ever
//     const adminExists = await User.findOne({ role: 'admin' });
//     if (adminExists) {
//       return res.status(400).json({
//         success: false,
//         message: 'Admin already exists. Only 1 admin is allowed in the system.',
//       });
//     }

//     if (!name || !email || !password) {
//       return res.status(400).json({ success: false, message: 'Name, email and password are required' });
//     }

//     const emailTaken = await User.findOne({ email });
//     if (emailTaken) {
//       return res.status(400).json({ success: false, message: 'Email already registered' });
//     }

//     const admin = await User.create({ name, email, password, role: 'admin' });
//     const token = generateToken(admin._id);

//     res.status(201).json({
//       success: true,
//       message: 'Admin account created successfully!',
//       data: {
//         token,
//         user: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// // ═══════════════════════════════════════════════════════
// //  2. STAFF CREATION  →  POST /api/auth/register-staff
// //     - Sirf Admin kar sakta hai (protect + adminOnly)
// //     - Staff khud register NAHI kar sakta
// //     - Admin /staff page se form fill karta hai
// // ═══════════════════════════════════════════════════════
// router.post('/register-staff', protect, adminOnly, async (req, res, next) => {
//   try {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: 'Name, email and password are required',
//       });
//     }

//     if (password.length < 6) {
//       return res.status(400).json({
//         success: false,
//         message: 'Password must be at least 6 characters',
//       });
//     }

//     const emailTaken = await User.findOne({ email });
//     if (emailTaken) {
//       return res.status(400).json({
//         success: false,
//         message: 'This email is already registered',
//       });
//     }

//     const staff = await User.create({ name, email, password, role: 'staff' });

//     res.status(201).json({
//       success: true,
//       message: `Staff account created for ${staff.name}`,
//       data: {
//         user: {
//           id: staff._id,
//           name: staff.name,
//           email: staff.email,
//           role: staff.role,
//           isActive: staff.isActive,
//           createdAt: staff.createdAt,
//         },
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// // ═══════════════════════════════════════════════════════
// //  3. LOGIN  →  POST /api/auth/login
// //     - Admin + Staff dono use karte hain
// //     - Email + Password
// // ═══════════════════════════════════════════════════════
// router.post('/login', async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ success: false, message: 'Email and password are required' });
//     }

//     const user = await User.findOne({ email, role: { $in: ['admin', 'staff'] } });

//     if (!user || !(await user.comparePassword(password))) {
//       return res.status(401).json({ success: false, message: 'Invalid email or password' });
//     }

//     if (!user.isActive) {
//       return res.status(403).json({
//         success: false,
//         message: 'Your account has been deactivated. Please contact the admin.',
//       });
//     }

//     const token = generateToken(user._id);

//     res.json({
//       success: true,
//       message: 'Login successful',
//       data: {
//         token,
//         user: { id: user._id, name: user.name, email: user.email, role: user.role },
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// // ═══════════════════════════════════════════════════════
// //  4. CUSTOMER OTP - SEND  →  POST /api/auth/customer/send-otp
// //     - Customer phone number deta hai
// //     - Real SMS via Twilio
// // ═══════════════════════════════════════════════════════
// router.post('/customer/send-otp', async (req, res, next) => {
//   try {
//     const { phone, name } = req.body;

//     if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Enter a valid 10-digit Indian mobile number',
//       });
//     }

//     let customer = await User.findOne({ phone, role: 'customer' });

//     // New customer - name required
//     if (!customer) {
//       if (!name || !name.trim()) {
//         return res.status(400).json({
//           success: false,
//           message: 'New user - please provide your name',
//           isNewUser: true,
//         });
//       }
//       customer = new User({ name: name.trim(), phone, role: 'customer' });
//     }

//     // Rate limit: 1 OTP per 60 seconds
//     if (customer.otp && customer.otp.expiresAt) {
//       const otpCreatedAt = new Date(customer.otp.expiresAt.getTime() - 10 * 60 * 1000);
//       const secondsElapsed = (Date.now() - otpCreatedAt.getTime()) / 1000;
//       if (secondsElapsed < 60) {
//         const waitSeconds = Math.ceil(60 - secondsElapsed);
//         return res.status(429).json({
//           success: false,
//           message: `Please wait ${waitSeconds} seconds before requesting another OTP`,
//         });
//       }
//     }

//     // Generate OTP and save
//     const otp = customer.generateOTP();
//     await customer.save();

//     // Send real SMS via Twilio
//     await sendOtpSms(phone, otp);

//     res.json({
//       success: true,
//       message: `OTP sent to +91 ${phone}. Valid for 10 minutes.`,
//     });
//   } catch (error) {
//     if (error.message && error.message.includes('SMS delivery failed')) {
//       return res.status(500).json({
//         success: false,
//         message: 'Could not send SMS. Please check the number and try again.',
//       });
//     }
//     next(error);
//   }
// });

// // ═══════════════════════════════════════════════════════
// //  5. CUSTOMER OTP - VERIFY  →  POST /api/auth/customer/verify-otp
// // ═══════════════════════════════════════════════════════
// router.post('/customer/verify-otp', async (req, res, next) => {
//   try {
//     const { phone, otp } = req.body;

//     if (!phone || !otp) {
//       return res.status(400).json({ success: false, message: 'Phone and OTP are required' });
//     }

//     const customer = await User.findOne({ phone, role: 'customer' });
//     if (!customer) {
//       return res.status(404).json({ success: false, message: 'No account found. Please register first.' });
//     }

//     if (!customer.verifyOTP(otp)) {
//       return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
//     }

//     // Clear OTP after use
//     customer.otp = undefined;
//     await customer.save();

//     const token = generateToken(customer._id);

//     res.json({
//       success: true,
//       message: 'Login successful!',
//       data: {
//         token,
//         user: {
//           id: customer._id,
//           name: customer.name,
//           phone: customer.phone,
//           role: customer.role,
//         },
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// // ═══════════════════════════════════════════════════════
// //  6. GET ME  →  GET /api/auth/me
// // ═══════════════════════════════════════════════════════
// router.get('/me', protect, (req, res) => {
//   res.json({ success: true, data: { user: req.user } });
// });

// // ═══════════════════════════════════════════════════════
// //  7. GET ALL STAFF  →  GET /api/auth/staff   (admin only)
// // ═══════════════════════════════════════════════════════
// router.get('/staff', protect, adminOnly, async (req, res, next) => {
//   try {
//     const staff = await User.find({ role: 'staff' })
//       .select('-password -otp')
//       .sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       data: { staff, total: staff.length },
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// // ═══════════════════════════════════════════════════════
// //  8. TOGGLE STAFF  →  PATCH /api/auth/staff/:id/toggle  (admin only)
// //     Activate / Deactivate
// // ═══════════════════════════════════════════════════════
// router.patch('/staff/:id/toggle', protect, adminOnly, async (req, res, next) => {
//   try {
//     const staff = await User.findOne({ _id: req.params.id, role: 'staff' });
//     if (!staff) {
//       return res.status(404).json({ success: false, message: 'Staff member not found' });
//     }

//     staff.isActive = !staff.isActive;
//     await staff.save();

//     res.json({
//       success: true,
//       message: `${staff.name} has been ${staff.isActive ? 'activated' : 'deactivated'}`,
//       data: { isActive: staff.isActive },
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// // ═══════════════════════════════════════════════════════
// //  9. DELETE STAFF  →  DELETE /api/auth/staff/:id  (admin only)
// // ═══════════════════════════════════════════════════════
// router.delete('/staff/:id', protect, adminOnly, async (req, res, next) => {
//   try {
//     const staff = await User.findOneAndDelete({ _id: req.params.id, role: 'staff' });
//     if (!staff) {
//       return res.status(404).json({ success: false, message: 'Staff member not found' });
//     }
//     res.json({ success: true, message: `${staff.name}'s account has been removed` });
//   } catch (error) {
//     next(error);
//   }
// });

// module.exports = router;








// backend/routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const StaffApplication = require('../models/StaffApplication');
const { protect, adminOnly } = require('../middleware/auth');
const { sendOtpSms, sendStaffCredentialsEmail } = require('../config/sms');

const router = express.Router();

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const cleanPressEmailRegex = /^[^\s@]+@cleanpress\.com$/i;
const gmailEmailRegex = /^[^\s@]+@gmail\.com$/i;
const normalizeEmail = (email) => email.toLowerCase().trim();

const generateStaffPassword = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

const generateStaffEmail = async () => {
  const staffCount = await User.countDocuments({ role: 'staff' });
  let nextNumber = staffCount + 1;
  let staffEmail = `staff${nextNumber}@gmail.com`;

  while (await User.exists({ email: staffEmail })) {
    nextNumber += 1;
    staffEmail = `staff${nextNumber}@gmail.com`;
  }

  return staffEmail;
};

// ═══════════════════════════════════════════════════════
//  1. ADMIN SETUP  →  POST /api/auth/register-admin
// ═══════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════
//  2. STAFF CREATION  →  POST /api/auth/register-staff
// ═══════════════════════════════════════════════════════
router.post('/register-staff', protect, adminOnly, async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }
    const staffEmail = normalizeEmail(email);
    if (!cleanPressEmailRegex.test(staffEmail)) {
      return res.status(400).json({ success: false, message: 'Staff email must be like example@cleanpress.com' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const emailTaken = await User.findOne({ email: staffEmail });
    if (emailTaken) {
      return res.status(400).json({ success: false, message: 'This email is already registered' });
    }

    const staff = await User.create({ name, email: staffEmail, password, role: 'staff' });

    res.status(201).json({
      success: true,
      message: `Staff account created for ${staff.name}`,
      data: {
        user: {
          id: staff._id, name: staff.name, email: staff.email,
          role: staff.role, isActive: staff.isActive, createdAt: staff.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

router.post('/staff-applications', async (req, res, next) => {
  try {
    const { name, email, phone, position, experience, skills } = req.body;

    if (!name || !email || !phone || !position || experience === undefined || !skills) {
      return res.status(400).json({
        success: false,
        message: 'Name, Gmail address, phone, position, experience and skills are required',
      });
    }

    const applicationEmail = normalizeEmail(email);
    if (!gmailEmailRegex.test(applicationEmail)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid Gmail address' });
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'Enter a valid 10-digit Indian mobile number' });
    }

    const existingApplication = await StaffApplication.findOne({
      email: applicationEmail,
      status: { $in: ['pending', 'approved'] },
    });
    if (existingApplication) {
      const message = existingApplication.status === 'pending'
        ? 'A pending request already exists for this Gmail address'
        : 'This Gmail address has already been approved for staff access';
      return res.status(400).json({ success: false, message });
    }

    const application = await StaffApplication.create({
      name,
      email: applicationEmail,
      phone,
      position,
      experience: Number(experience),
      skills,
    });

    res.status(201).json({
      success: true,
      message: 'Staff vacancy request submitted. Admin will review eligibility.',
      data: { application },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/staff-applications', protect, adminOnly, async (req, res, next) => {
  try {
    const applications = await StaffApplication.find()
      .populate('reviewedBy', 'name email')
      .populate('staffUser', 'name email role isActive createdAt')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: { applications, total: applications.length } });
  } catch (error) {
    next(error);
  }
});

router.patch('/staff-applications/:id/approve', protect, adminOnly, async (req, res, next) => {
  try {
    const application = await StaffApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Staff request not found' });
    }
    if (application.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'This request has already been reviewed' });
    }

    const staffEmail = await generateStaffEmail();
    const existingUser = await User.findOne({ email: staffEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Could not generate a unique staff login email' });
    }

    const password = generateStaffPassword();
    const staff = await User.create({
      name: application.name,
      email: staffEmail,
      password,
      role: 'staff',
    });

    try {
      await sendStaffCredentialsEmail({
        email: application.email,
        loginEmail: staff.email,
        name: staff.name,
        password,
      });
    } catch (emailError) {
      await User.findByIdAndDelete(staff._id);
      throw emailError;
    }

    application.status = 'approved';
    application.reviewedBy = req.user._id;
    application.reviewedAt = new Date();
    application.staffUser = staff._id;
    await application.save();

    res.json({
      success: true,
      message: `Approved ${staff.name}. Login credentials were sent to ${application.email}.`,
      data: {
        application,
        user: {
          id: staff._id,
          name: staff.name,
          email: staff.email,
          role: staff.role,
          isActive: staff.isActive,
          createdAt: staff.createdAt,
        },
      },
    });
  } catch (error) {
    if (error.message && error.message.includes('Email delivery failed')) {
      return res.status(500).json({
        success: false,
        message: 'Staff account was not approved because the credentials email could not be sent.',
      });
    }
    next(error);
  }
});

router.patch('/staff-applications/:id/reject', protect, adminOnly, async (req, res, next) => {
  try {
    const application = await StaffApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Staff request not found' });
    }
    if (application.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'This request has already been reviewed' });
    }

    application.status = 'rejected';
    application.reviewedBy = req.user._id;
    application.reviewedAt = new Date();
    await application.save();

    res.json({ success: true, message: `${application.name}'s request was rejected`, data: { application } });
  } catch (error) {
    next(error);
  }
});

// ═══════════════════════════════════════════════════════
//  3. STAFF/ADMIN LOGIN  →  POST /api/auth/login
// ═══════════════════════════════════════════════════════
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email, role: { $in: ['admin', 'staff'] } });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact the admin.',
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      },
    });
  } catch (error) {
    next(error);
  }
});

// ═══════════════════════════════════════════════════════
//  4. CUSTOMER OTP - SEND  →  POST /api/auth/customer/send-otp
//
//  Flow:
//  - Customer sends { phone, email, name? }
//  - phone → stored in DB to link with orders
//  - email → OTP is sent here via Gmail
//  - If new customer → name required first
// ═══════════════════════════════════════════════════════
router.post('/customer/send-otp', async (req, res, next) => {
  try {
    const { phone, email, name } = req.body;

    // ── Validate phone ──────────────────────────────────
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid 10-digit Indian mobile number',
      });
    }

    // ── Validate email ──────────────────────────────────
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Enter a valid email address to receive OTP',
      });
    }

    // ── Find or create customer ─────────────────────────
    let customer = await User.findOne({ phone, role: 'customer' });

    if (!customer) {
      // New customer — name required
      if (!name || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: 'New user — please provide your name',
          isNewUser: true,
        });
      }
      // Create new customer with phone + email + name
      customer = new User({
        name: name.trim(),
        phone,
        email: email.toLowerCase().trim(),
        role: 'customer',
      });
    } else {
      // Existing customer — update email in case they changed it
      customer.email = email.toLowerCase().trim();
    }

    // ── Rate limit: 1 OTP per 60 seconds ───────────────
    if (customer.otp && customer.otp.expiresAt) {
      const otpCreatedAt = new Date(customer.otp.expiresAt.getTime() - 10 * 60 * 1000);
      const secondsElapsed = (Date.now() - otpCreatedAt.getTime()) / 1000;
      if (secondsElapsed < 60) {
        const waitSeconds = Math.ceil(60 - secondsElapsed);
        return res.status(429).json({
          success: false,
          message: `Please wait ${waitSeconds} seconds before requesting another OTP`,
        });
      }
    }

    // ── Generate OTP and save to DB ─────────────────────
    const otp = customer.generateOTP();
    await customer.save();

    // ── Send OTP via Email ──────────────────────────────
    await sendOtpSms(email, otp); // function name kept same — now sends email

    res.json({
      success: true,
      message: `OTP sent to ${email}. Valid for 10 minutes.`,
    });

  } catch (error) {
    console.error('send-otp error:', error.message);
    if (error.message && error.message.includes('Email delivery failed')) {
      return res.status(500).json({
        success: false,
        message: 'Could not send OTP email. Please check your email address and try again.',
      });
    }
    next(error);
  }
});

// ═══════════════════════════════════════════════════════
//  5. CUSTOMER OTP - VERIFY  →  POST /api/auth/customer/verify-otp
// ═══════════════════════════════════════════════════════
router.post('/customer/verify-otp', async (req, res, next) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ success: false, message: 'Phone and OTP are required' });
    }

    const customer = await User.findOne({ phone, role: 'customer' });
    if (!customer) {
      return res.status(404).json({ success: false, message: 'No account found. Please register first.' });
    }

    if (!customer.verifyOTP(otp)) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP. Try again.' });
    }

    // Clear OTP after successful verification (one-time use)
    customer.otp = undefined;
    await customer.save();

    const token = generateToken(customer._id);

    res.json({
      success: true,
      message: 'Login successful!',
      data: {
        token,
        user: {
          id: customer._id,
          name: customer.name,
          phone: customer.phone,
          role: customer.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// ═══════════════════════════════════════════════════════
//  6. GET ME  →  GET /api/auth/me
// ═══════════════════════════════════════════════════════
router.get('/me', protect, (req, res) => {
  res.json({ success: true, data: { user: req.user } });
});

// ═══════════════════════════════════════════════════════
//  7. GET ALL STAFF  →  GET /api/auth/staff  (admin only)
// ═══════════════════════════════════════════════════════
router.get('/staff', protect, adminOnly, async (req, res, next) => {
  try {
    const staff = await User.find({ role: 'staff' })
      .select('-password -otp')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: { staff, total: staff.length } });
  } catch (error) {
    next(error);
  }
});

// ═══════════════════════════════════════════════════════
//  8. TOGGLE STAFF  →  PATCH /api/auth/staff/:id/toggle
// ═══════════════════════════════════════════════════════
router.patch('/staff/:id/toggle', protect, adminOnly, async (req, res, next) => {
  try {
    const staff = await User.findOne({ _id: req.params.id, role: 'staff' });
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }

    staff.isActive = !staff.isActive;
    await staff.save();

    res.json({
      success: true,
      message: `${staff.name} has been ${staff.isActive ? 'activated' : 'deactivated'}`,
      data: { isActive: staff.isActive },
    });
  } catch (error) {
    next(error);
  }
});

// ═══════════════════════════════════════════════════════
//  9. DELETE STAFF  →  DELETE /api/auth/staff/:id
// ═══════════════════════════════════════════════════════
router.delete('/staff/:id', protect, adminOnly, async (req, res, next) => {
  try {
    const staff = await User.findOneAndDelete({ _id: req.params.id, role: 'staff' });
    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }
    res.json({ success: true, message: `${staff.name}'s account has been removed` });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
