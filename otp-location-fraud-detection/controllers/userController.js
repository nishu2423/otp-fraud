const haversine = require('haversine');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const generateOTP = () => Math.floor(100000 + Math.random() * 900000);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send OTP
exports.sendOTP = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  const { cardNumber, cardHolderName, cvv, expirationDate, registeredPhoneNumber, registeredEmail, latitude, longitude } = req.body;

  try {
    // Step 1: Verify card details and email with the database
    const user = await User.findOne({
      cardNumber,
      cardHolderName,
      cvv,
      expirationDate,
      registeredPhoneNumber,
      registeredEmail,
    });

    if (!user) {
      return res.status(404).json({ message: 'Invalid card details, mobile number, or email' });
    }

    // Step 2: Generate OTP
    const otp = generateOTP();
    user.otp = otp.toString();
    user.otpRequestLocation = { lat: latitude, lng: longitude }; // Store the location where OTP was requested
    user.otpExpiresAt = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes
    await user.save();

    // Step 3: Send OTP via email
    const otpLink = `http://localhost:3000/otp/${otp}`;

    const alertEmailOptions = {
      from: process.env.EMAIL_USER,
      to: registeredEmail,
      subject: 'Your OTP for Transaction Verification',
      text: `Click the following link to get your OTP: ${otpLink}. It will expire in 5 minutes.`,
    };

    transporter.sendMail(alertEmailOptions, (error) => {
      if (error) {
        return res.status(500).json({ message: 'Failed to send OTP via email', error: error.message });
      }
      res.status(200).json({ message: 'OTP link sent successfully to registered email' });
    });
  } catch (error) {
    console.error('Error in sendOTP:', error);
    res.status(500).json({ message: 'Failed to send OTP', error: error.message });
  }
};

// Handle OTP Link Click
// Handle OTP Link Click
exports.handleOTPLinkClick = async (req, res) => {
  console.log('handleOTPLinkClick route hit'); // Debugging
  const { otp } = req.params;
  const { latitude, longitude } = req.body;

  console.log('Received OTP:', otp); // Debugging
  console.log('Received location:', { latitude, longitude }); // Debugging

  try {
    const user = await User.findOne({ otp });

    if (!user) {
      return res.status(404).json({ message: 'Invalid OTP' });
    }

    user.otpClickLocation = { lat: latitude, lng: longitude };
    await user.save();

    console.log('Location stored successfully:', user.otpClickLocation); // Debugging
    res.status(200).json({ message: 'OTP link clicked successfully. Location stored.', otp });
  } catch (error) {
    console.error('Error in handleOTPLinkClick:', error); // Debugging
    res.status(500).json({ message: 'Failed to handle OTP link click', error: error.message });
  }
};
// Verify Transaction
exports.verifyTransaction = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  const { cardNumber, otp } = req.body;

  try {
    // Fetch the user by card number
    const user = await User.findOne({ cardNumber });
    if (!user) {
      return res.status(404).json({ message: 'Card not found' });
    }

    // Verify OTP
    if (Date.now() > user.otpExpiresAt) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    if (otp !== user.otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Fetch both locations from the database
    const location1 = user.otpRequestLocation; // Location where OTP was requested
    const location2 = user.otpClickLocation; // Location where OTP link was clicked

    // Validate locations
    if (!location1 || !location2 || isNaN(location1.lat) || isNaN(location1.lng) || isNaN(location2.lat) || isNaN(location2.lng)) {
      user.otpClickLocation = { lat: 90, lng: 180 }; // Set to maximum latitude and longitude
      await user.save();
      return res.status(400).json({ message: 'Invalid location data' });
    }


    console.log('Location 1:', location1);
    console.log('Location 2:', location2);

    // Convert location objects to the correct format
const start = { latitude: location1.lat, longitude: location1.lng };
const end = { latitude: location2.lat, longitude: location2.lng };

// Calculate the distance between the two locations
const distance = haversine(start, end, { unit: 'meter' });
console.log('Distance:', distance);


    // Verify if the distance is within the allowed range (e.g., 100 meters)
    const ALLOWED_DISTANCE = 100; // 100 meters
    if (isNaN(distance) || distance > ALLOWED_DISTANCE) {
      user.otpClickLocation = { lat: 90, lng: 180 }; // Set to maximum latitude and longitude
      await user.save();
      return res.status(403).json({ message: 'Location mismatch detected. Transaction not verified.' });
    }

    // If all conditions are satisfied, approve the transaction
    // Invalidate the otpClickLocation for future transactions
    user.otpClickLocation = { lat: 90, lng: 180 }; // Set to maximum latitude and longitude
    await user.save();

    res.status(200).json({ message: 'Transaction successful' });
  } catch (error) {
    console.error('Error in verifyTransaction:', error);
    res.status(500).json({ message: 'Error verifying transaction', error: error.message });
  }
};