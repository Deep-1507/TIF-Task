const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {

    const user = await User.create({ name, email, password});
    console.log("User created:", user);

    res.status(201).json({
      status: true,
      content: {
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          created_at: user.createdAt,
        },
      },
    });
  } catch (err) {
    console.error('Signup error:', err);
    next(err);
  }
};



exports.signin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(400).json({ status: false, error: 'Invalid credentials' });
      }
      
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ status: false, error: 'Invalid credentials' });
      }
      
      console.log("Password matched!");
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  
      res.status(200).json({ status: true, content: { data: { token } } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: false, error: 'Server error' });
    }
  };  
  

  exports.getMe = async (req, res) => {
    const user = req.user;
    res.status(200).json({
      status: true,
      content: {
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          created_at: user.createdAt,
        },
      },
    });
  };
  