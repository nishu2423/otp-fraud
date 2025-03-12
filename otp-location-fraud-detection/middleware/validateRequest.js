const { sendOTPSchema, verifyTransactionSchema } = require('./validationSchema');

const validateRequest = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).json({ message: 'Validation failed', errors });
  }
  next();
};

module.exports = {
  validateSendOTP: validateRequest(sendOTPSchema),
  validateVerifyTransaction: validateRequest(verifyTransactionSchema),
};