const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setup storage with dynamic folder structure
const chat_files = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const senderId = req.query.senderId || "unknown-sender";
        const receiverId = req.query.receiverId || "unknown-receiver";
        return {
            folder: `chat-app/chat-files/${senderId}/${receiverId}`, // Store files in sender/receiver folders
            public_id: `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`,
            resource_type: "auto",
        };
    },
});

const upload = multer({ storage: chat_files });

module.exports = { upload, cloudinary };
