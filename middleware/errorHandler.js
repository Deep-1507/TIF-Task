module.exports = (err, req, res, next) => {
    console.error('Error stack:', err.stack);
    res.status(500).json({
      status: false,
      error: process.env.NODE_ENV === 'production' ? 'Server error' : err.message,
    });
  };  