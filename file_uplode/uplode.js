const asyncHandler = require("express-async-handler");


//
// Upload a file to Cloudinary
//

const uploadFile = asyncHandler(
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    res.status(200).json({
      message: "File uploaded successfully",
      fileUrl: req.file.path,
      senderId: req.query.senderId,
      receiverId: req.query.receiverId,
    });
  })

module.exports = { uploadFile };
