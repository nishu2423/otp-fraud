# OTP Verification System with Location-Based Authentication

A secure transaction verification system combining OTP (One-Time Password) with geolocation validation to prevent fraudulent activities.

## Features

- ✉️ Email-based OTP delivery with expiration (5 minutes)
- 📍 Location verification using Haversine distance calculation
- 🛡️ Two-factor authentication (card details + location)
- ⏱️ Time-sensitive OTP validation
- 📊 MongoDB storage for audit trails

## System Flow:    
    User->>Frontend: Initiates transaction (card details + location)
    Frontend->>Backend: POST /send-otp
    Backend->>Database: Verify card details
    Backend->>Database: Store OTP with request location
    Backend->>EmailService: Send OTP link
    EmailService->>User: Email with OTP link
    User->>Frontend: Clicks OTP link (with current location)
    Frontend->>Backend: POST /handle-otp-click
    Backend->>Database: Store click location
    User->>Frontend: Submits OTP for transaction
    Frontend->>Backend: POST /verify-transaction
    Backend->>Database: Verify OTP and locations
    Backend->>Frontend: Approve/Reject transaction

    ![Picture1](https://github.com/user-attachments/assets/daab00d7-d0bc-436a-ac23-90c320cc3bfc)


## Installation
Clone the repository:
git clone https://github.com/yourusername/otp-verification-system.git
cd otp-verification-system

## Install dependencies:
npm install

## Configure environment variables:
env
# .env file
MONGODB_URI=your_mongodb_connection_string
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
JWT_SECRET=your_jwt_secret_key
Start the server:

bash
npm start
