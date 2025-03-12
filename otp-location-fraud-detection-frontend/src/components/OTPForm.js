import React, { useState, useContext } from 'react';
import { sendOTP } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import './OTPForm.css';

const OTPForm = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [cvv, setCvv] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // Validate inputs before submitting
  const validateInputs = () => {
    if (!cardNumber || cardNumber.length !== 16) {
      setMessage('Card number must be 16 digits.');
      return false;
    }
    if (!cardHolderName) {
      setMessage('Cardholder name is required.');
      return false;
    }
    if (!cvv || cvv.length !== 3) {
      setMessage('CVV must be 3 digits.');
      return false;
    }
    if (!expirationDate || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expirationDate)) {
      setMessage('Expiration date must be in MM/YY format.');
      return false;
    }
    if (!phoneNumber || phoneNumber.length !== 10) {
      setMessage('Phone number must be 10 digits.');
      return false;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage('Invalid email address.');
      return false;
    }
    return true;
  };

  const handleSendOTP = async () => {
    // Validate inputs before proceeding
    if (!validateInputs()) {
      return;
    }

    try {
      setMessage('Fetching location...');
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const data = {
        cardNumber,
        cardHolderName,
        cvv,
        expirationDate,
        registeredPhoneNumber: phoneNumber,
        registeredEmail: email,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      setMessage('Sending OTP...');
      const response = await sendOTP(data);
      setMessage(response.message);
    } catch (error) {
      if (error.response) {
        // Backend returned an error (e.g., 404 for invalid card details or email)
        if (error.response.status === 404) {
          setMessage('Invalid details. Please check your card information and email.');
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
    <div className={`otp-form-container ${theme}`}>
      <button onClick={toggleTheme} className="btn btn-secondary">
        Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>
      <h2>Enter Card Details to Receive OTP</h2>
      <form className="otp-form">
        <input
          type="text"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          placeholder="Card Number"
          className="form-control"
        />
        <input
          type="text"
          value={cardHolderName}
          onChange={(e) => setCardHolderName(e.target.value)}
          placeholder="Cardholder Name"
          className="form-control"
        />
        <input
          type="password"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
          placeholder="CVV"
          className="form-control"
        />
        <input
          type="text"
          value={expirationDate}
          onChange={(e) => setExpirationDate(e.target.value)}
          placeholder="Expiration Date (MM/YY)"
          className="form-control"
        />
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Registered Mobile Number"
          className="form-control"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Registered Email Address"
          className="form-control"
        />
        <button type="button" onClick={handleSendOTP} className="btn btn-primary">
          Send OTP
        </button>
      </form>
      {message && (
        <div className={`alert alert-${message.includes('success') ? 'success' : 'danger'} mt-3`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default OTPForm;