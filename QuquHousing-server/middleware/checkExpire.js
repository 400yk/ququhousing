const express = require('express');

const app = express();
const query = require('../config/query');
// const fsPromises = require('fs').promises;
// const path = require('path');

// Middleware to check trial expiration
const checkExpire = async (req, res, next) => {
  foundUser = await query(`SELECT userId, memberExpiration FROM userInfo WHERE username='${req.user}'`);
  // const data = await fsPromises.readFile(path.join(__dirname, '..', 'model', 'users.json'));
  // const users = JSON.parse(data);

  // const foundUser = users.find(person => person.username === req.user);
  const today = new Date();
  if (foundUser?.length === 0 || !foundUser[0]?.memberExpiration || new Date(foundUser[0].memberExpiration) < today) {
    // Trial expired, redirect or handle as needed
    res.status(403).json({
      "message": "memberExpired",
    });
  } else {
    next(); // Continue to the next middleware or route handler
  }
}


module.exports = checkExpire;