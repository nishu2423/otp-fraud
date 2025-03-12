
import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import './Header.css';

const Header = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <header className={theme}>
      <h1>OTP Fraud Detection System</h1>
    </header>
  );
};

export default Header;