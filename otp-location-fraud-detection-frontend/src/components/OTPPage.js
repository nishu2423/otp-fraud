
// //.......................................................................................................
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import axios from 'axios';
import './OTPPage.css';

const OTPPage = () => {
  console.log('OTPPage component rendered'); // Debugging
  const { theme } = useContext(ThemeContext);
  const { otp } = useParams();
  const [message, setMessage] = useState('');

  useEffect(() => {
    console.log('useEffect triggered'); // Debugging
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Fetched location:', { latitude, longitude }); // Debugging

        try {
          const response = await axios.post(`http://localhost:5000/api/users/otp/${otp}`, {
            latitude,
            longitude,
          });

          console.log('Backend response:', response.data); // Debugging
          setMessage(`OTP: ${otp}. Location stored successfully.`);
        } catch (error) {
          console.error('Error storing location:', error); // Debugging
          setMessage('Failed to store location. Please try again.');
        }
      },
      (error) => {
        console.error('Geolocation error:', error); // Debugging
        setMessage('Failed to get location. Please enable GPS and try again.');
      }
    );
  }, [otp]);

  return (
    <div className={`otp-page-container ${theme}`}>
      <h2>Your OTP</h2>
      <p>{message}</p>
    </div>
  );
};

export default OTPPage;