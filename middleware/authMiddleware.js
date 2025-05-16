const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ status: false, error: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Assuming your User model uses _id as primary key
    const user = await User.findById(decoded.id).select('-password'); // exclude password for safety
    if (!user) {
      return res.status(401).json({ status: false, error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    let message = 'Unauthorized';
    if (err.name === 'TokenExpiredError') {
      message = 'Token expired';
    } else if (err.name === 'JsonWebTokenError') {
      message = 'Invalid token';
    }
    res.status(401).json({ status: false, error: message });
  }
};