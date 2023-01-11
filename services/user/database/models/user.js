const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: { type: String, default: null },
  phone: { type: Number, default: null },

  password: { type: String, required: true },
  otp: { type: Number, default: null },

  isAdmin: { type: Boolean, default: false },

  towFactAuth: { type: Boolean, default: false },
  otpAuth: { type: Boolean, default: false },

  tfaMethod: {
    google: { type: Boolean, default: false },
    phone: { type: Boolean, default: false },
    email: { type: Boolean, default: false },
  },

  tempToken: String,

  secret: {
    key: { type: String, default: '' },
    qrcode: { type: String, default: '`' },
  },

  token: [String],
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
