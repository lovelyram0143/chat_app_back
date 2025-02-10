const mongoose = require("mongoose"); // Erase if already required
require("./user"); // Ensure User model is loaded before MessageSchema

// Message schema with ObjectId references
const UserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    { timestamps: true }
);
module.exports = mongoose.model("User", UserSchema);
