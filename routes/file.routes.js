const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const File = require('../models/files.model.js');
const cloudinary = require('../config/cloudinary');

// Upload file route
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Save file info to database
    const newFile = new File({
      filename: req.file.filename,
      originalName: req.file.originalname,
      cloudinaryUrl: req.file.path,
      cloudinaryId: req.file.filename,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      uploadedBy: req.user ? req.user._id : null // Check if user exists
    });

    await newFile.save();

    res.status(201).json({
      message: 'File uploaded successfully',
      file: newFile
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading file', error: error.message });
  }
});

// Get all files route
router.get('/files', async (req, res) => {
  try {
    // If user is authenticated, get their files only, otherwise get all files
    const query = req.user ? { uploadedBy: req.user._id } : {};
    const files = await File.find(query)
      .sort({ uploadedAt: -1 });
    
    res.status(200).json({ files });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching files' });
  }
});

// Delete file route
router.delete('/files/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Check if user owns the file (if authentication exists)
    if (req.user && file.uploadedBy && file.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized to delete this file' });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(file.cloudinaryId);

    // Delete from database
    await File.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting file' });
  }
});

// Download file route
router.get('/files/:id/download', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.redirect(file.cloudinaryUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error downloading file' });
  }
});

module.exports = router;