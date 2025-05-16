const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Snowflake } = require('@theinternetfolks/snowflake');

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        default: () => Snowflake.generate(),
        unique: true,
      },      
  name: { type: String, maxlength: 64 },
  email: { type: String, required: true, unique: true, maxlength: 128 },
  password: { type: String, required: true, select: false },
  created_at: { type: Date, default: Date.now },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);