const express = require("express");

const { uploadFile, file } = require("../file_uplode/uplode");


const router = express.Router();


router.post('/file_uplode', file, uploadFile)


module.exports = router 