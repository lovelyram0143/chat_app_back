const express = require("express");

const { uploadFile } = require("../file_uplode/uplode");
const { upload } = require("../config/cloudinary");


const router = express.Router();


router.post('/file_uplode',upload.single("file"), uploadFile)


module.exports = router 