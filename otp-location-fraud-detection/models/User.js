
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  cardNumber: { type: String, required: true, unique: true },
  cardHolderName: { type: String, required: true },
  cvv: { type: String, required: true },
  expirationDate: { type: String, required: true },
  registeredPhoneNumber: { type: String, required: true },
  registeredEmail: { type: String, required: true, unique: true },
  otp: { type: String },
  otpExpiresAt: { type: Date },
  otpRequestLocation: { // Location where OTP was requested
    lat: { type: Number },
    lng: { type: Number },
  },
  otpClickLocation: { // Location where OTP link was clicked
    lat: { type: Number },
    lng: { type: Number },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
