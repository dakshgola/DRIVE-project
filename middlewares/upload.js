const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'drive-clone', // Folder name in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'txt', 'mp4', 'mp3'],
    resource_type: 'auto' // Automatically detect file type
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

module.exports = upload;