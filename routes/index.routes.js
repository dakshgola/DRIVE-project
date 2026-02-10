const express = require('express');
const router = express.Router();
const fileModel = require('../models/files.model');
const authMiddleware = require('../middlewares/auth');

router.get('/home', authMiddleware, (req, res) => {
  res.render('home');
});

router.post('/upload', async (req, res) => {
  // Handle file upload logic here
  const newFile = await new fileModel.create({
    filename: req.body.filename,
    path: req.body.path,
    originalName: req.body.originalName,
    user: req.body.user
  });
  res.json({ message: "File uploaded successfully", file: newFile });
});

 module.exports = router;
