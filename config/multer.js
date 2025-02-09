const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'chat-files',
        format: async (req, file) => file.mimetype.split('/')[1], // Use original file format
        public_id: (req, file) => `chat_${Date.now()}_${file.originalname}`
    }
});

const upload = multer({ storage: storage });

module.exports = upload;