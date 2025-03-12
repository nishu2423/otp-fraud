
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import OTPForm from './components/OTPForm';
import OTPVerification from './components/OTPVerification';
import OTPPage from './components/OTPPage';
import ErrorPage from './components/ErrorPage';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <h1>OTP Location-Based Verification</h1>
          <div className="form">
            <Routes>
              <Route path="/" element={<><OTPForm /><OTPVerification /></>} />
              <Route path="/otp/:otp" element={<OTPPage />} />
              <Route path="/error" element={<ErrorPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;