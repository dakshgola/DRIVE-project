const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.get('/register', (req, res) => {
  res.render('register');
});

router.post(
  '/register',
  [
    body('email')
      .trim()
      .isEmail().withMessage('Enter a valid email')
      .isLength({ min: 10 }).withMessage('Email must be at least 10 characters'),
    body('password')
      .trim()
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('username')
      .trim()
      .notEmpty().withMessage('Username is required')
  ],
  async (req, res) => {
    try {
      console.log("BODY:", req.body); // 🔎 debug line
      const errors = validationResult(req);
      
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          errors: errors.array(), 
          message: "Validation failed" 
        });
      }

      const { email, password, username } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const newUser = new User({
        email,
        password: hashedPassword,
        username
      });
      
      await newUser.save();
      
      res.status(201).json({ 
        message: "User registered successfully", 
        user: newUser 
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.get('/login', (req, res) => {
  res.render('login');
});

router.post(
  '/login',
  [
    body('username')
      .trim()
      .notEmpty().withMessage('Username is required'),
    body('password')
      .trim()
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          errors: errors.array(), 
          message: "invalid data" 
        });
      }

      const { username, password } = req.body;
      const user = await User.findOne({ username });
      
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict'
      });

      res.status(200).json({ 
        message: "Login successful", 
        user, 
        token 
      });
      
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;