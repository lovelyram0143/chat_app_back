const express = require("express");
const { createUser } = require("../contoler/usercontol");
const router = express.Router();

router.post("/register", createUser);

module.exports = router;
