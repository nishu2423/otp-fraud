
//.....................................,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,

import React, { useState, useContext } from 'react';
import { verifyTransaction } from '../services/api';
import { ThemeContext } from '../context/ThemeContext';
import './OTPVerification.css';

const OTPVerification = () => {
  const { theme } = useContext(ThemeContext);
  const [cardNumber, setCardNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');

  const handleVerifyTransaction = async () => {
    try {
      setMessage('Fetching location and verifying transaction...');

      // Fetch the user's current location
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;

      // Prepare the data to send to the backend
      const data = {
        cardNumber,
        otp,
        latitude, // Include latitude
        longitude, // Include longitude
      };

      // Send the data to the backend for verification
      const response = await verifyTransaction(data);
      setMessage(response.message);
    } catch (error) {
      if (error.response) {
        // Backend returned an error (e.g., 400 for wrong OTP)
        if (error.response.status === 400) {
          setMessage('Wrong OTP. Please enter the correct OTP.');
        } else {
          setMessage(`Error: ${error.response.data.message}`);
        }
      } else if (error.code === error.PERMISSION_DENIED || error.code === error.POSITION_UNAVAILABLE) {
        // Geolocation error
        setMessage('Failed to get location. Please enable GPS and try again.');
      } else {
        // Network or other errors
        setMessage(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div className={`otp-verification-container ${theme}`}>
      <h2>Verify Your Transaction</h2>
      <div className="otp-layout">
        <div className="card-image">
          <img src="https://www.pngplay.com/wp-content/uploads/7/Debit-Card-Transparent-Image.png" alt="Virtual Debit Card" />
        </div>
        <div className="otp-form">
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="Card Number"
            className="form-control"
          />
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="form-control"
          />
          <button type="button" onClick={handleVerifyTransaction} className="btn btn-primary">
            Verify Transaction
          </button>
        </div>
      </div>
      {message && (
        <div className={`alert alert-${message.includes('success') ? 'success' : 'danger'} mt-3`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default OTPVerification;
