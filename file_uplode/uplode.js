const asyncHandler = require("express-async-handler");

const upload = require('../config/multer');
//
// Upload a file to Cloudinary
//
const file = upload.single('file')
const uploadFile = asyncHandler(
  async (req, res) => {
    const fileUrl = req.file ? req.file.path : null;
    try {
      if (!fileUrl) return res.status(400).json({ message: "No file uploaded" });

      res.status(201).json({ fileUrl });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  })

module.exports = { uploadFile, file };
