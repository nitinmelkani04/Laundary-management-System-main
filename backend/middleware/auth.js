
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ─── Verify JWT and attach user to request ───────────
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Please login.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password -otp');
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not found.' });
    }
    if (!req.user.isActive) {
      return res.status(403).json({ success: false, message: 'Account deactivated.' });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token. Please login again.',
    });
  }
};

// ─── Role guards ─────────────────────────────────────

// Only admin
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  res.status(403).json({ success: false, message: 'Admin access only.' });
};

// Admin or Staff (not customers)
const staffOrAdmin = (req, res, next) => {
  if (req.user && ['admin', 'staff'].includes(req.user.role)) return next();
  res.status(403).json({
    success: false,
    message: 'Staff or Admin access required.',
  });
};

// Only customers
const customerOnly = (req, res, next) => {
  if (req.user && req.user.role === 'customer') return next();
  res.status(403).json({ success: false, message: 'Customer access only.' });
};

module.exports = { protect, adminOnly, staffOrAdmin, customerOnly };
