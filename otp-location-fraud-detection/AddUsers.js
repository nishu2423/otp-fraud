
//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&


const mongoose = require('mongoose');
const faker = require('@faker-js/faker').faker;
const User = require('./models/User');  // Ensure correct path to User model
require('dotenv').config();

// Connect to the MongoDB database
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to the database');
    addUsers();
  })
  .catch((error) => {
    console.log('Error connecting to the database:', error);
  });

// Generate fake users with email
const addUsers = async () => {
  const users = [];
  
  for (let i = 0; i < 100; i++) {
    const user = {
      cardNumber: faker.finance.creditCardNumber(),  // Generates a random credit card number
      cardHolderName: faker.person.fullName(),  // Generates a random cardholder name
      cvv: faker.finance.creditCardCVV(),  // Generates a random CVV
      expirationDate: `${faker.date.future(1).getMonth() + 1}/${faker.date.future(1).getFullYear().toString().slice(-2)}`,  // MM/YY format
      registeredPhoneNumber: faker.phone.number('##########'),  // 10-digit phone number
      registeredEmail: faker.internet.email(),  // Generates a random email address
    };
    
    users.push(user);  // Add user directly to the list
  }

  try {
    await User.insertMany(users);
    console.log('100 fake users added to the database');
    mongoose.connection.close();
  } catch (error) {
    console.log('Error inserting users:', error);
  }
};

