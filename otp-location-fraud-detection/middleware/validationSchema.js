const Joi = require('joi');

// Schema for sending OTP
const sendOTPSchema = Joi.object({
  cardNumber: Joi.string().length(16).required().messages({
    'string.length': 'Card number must be 16 digits',
    'any.required': 'Card number is required',
  }),
  cardHolderName: Joi.string().required().messages({
    'any.required': 'Cardholder name is required',
  }),
  cvv: Joi.string().length(3).required().messages({
    'string.length': 'CVV must be 3 digits',
    'any.required': 'CVV is required',
  }),
  expirationDate: Joi.string().pattern(/^(0[1-9]|1[0-2])\/\d{2}$/).required().messages({
    'string.pattern.base': 'Expiration date must be in MM/YY format',
    'any.required': 'Expiration date is required',
  }),
  registeredPhoneNumber: Joi.string().length(10).required().messages({
    'string.length': 'Phone number must be 10 digits',
    'any.required': 'Phone number is required',
  }),
  registeredEmail: Joi.string().email().required().messages({
    'string.email': 'Invalid email address',
    'any.required': 'Email is required',
  }),
  latitude: Joi.number().min(-90).max(90).required().messages({
    'number.min': 'Invalid latitude',
    'number.max': 'Invalid latitude',
    'any.required': 'Latitude is required',
  }),
  longitude: Joi.number().min(-180).max(180).required().messages({
    'number.min': 'Invalid longitude',
    'number.max': 'Invalid longitude',
    'any.required': 'Longitude is required',
  }),
});

// Schema for verifying transaction
const verifyTransactionSchema = Joi.object({
  cardNumber: Joi.string().length(16).required().messages({
    'string.length': 'Card number must be 16 digits',
    'any.required': 'Card number is required',
  }),
  otp: Joi.string().length(6).required().messages({
    'string.length': 'OTP must be 6 digits',
    'any.required': 'OTP is required',
  }),
  latitude: Joi.number().min(-90).max(90).required().messages({
    'number.min': 'Invalid latitude',
    'number.max': 'Invalid latitude',
    'any.required': 'Latitude is required',
  }),
  longitude: Joi.number().min(-180).max(180).required().messages({
    'number.min': 'Invalid longitude',
    'number.max': 'Invalid longitude',
    'any.required': 'Longitude is required',
  }),
});

module.exports = { sendOTPSchema, verifyTransactionSchema };