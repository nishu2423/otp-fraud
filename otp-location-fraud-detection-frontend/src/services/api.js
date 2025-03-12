
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/users';

export const sendOTP = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/sendOTP`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyTransaction = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/verifyTransaction`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};