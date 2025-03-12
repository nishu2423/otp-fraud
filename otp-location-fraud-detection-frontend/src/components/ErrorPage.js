
import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import './ErrorPage.css';

const ErrorPage = () => {
  const { theme } = useContext(ThemeContext);
  const location = useLocation();
  const error = location.state?.error || 'An unexpected error occurred.';

  return (
    <div className={`container mt-5 ${theme}`}>
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Oops! Something went wrong.</h4>
        <p>{error}</p>
        <hr />
        <p className="mb-0">Please try again later or contact support.</p>
      </div>
    </div>
  );
};

export default ErrorPage;