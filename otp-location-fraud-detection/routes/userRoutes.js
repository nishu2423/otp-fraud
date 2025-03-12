
const express = require('express');
const router = express.Router();
const { sendOTP, verifyTransaction, handleOTPLinkClick } = require('../controllers/userController'); // Import handleOTPLinkClick
const { validateSendOTP, validateVerifyTransaction } = require('../middleware/validateRequest');

router.post('/sendOTP', validateSendOTP, sendOTP);
router.post('/verifyTransaction', validateVerifyTransaction, verifyTransaction);
router.post('/otp/:otp', handleOTPLinkClick); // Add this route

module.exports = router;