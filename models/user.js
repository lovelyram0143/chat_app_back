const mongoose = require("mongoose"); // Erase if already required


// Message schema with ObjectId references
const UserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        isOnline: { type: Boolean, default: false },
        lastSeen: { type: Date, default: null },
    },
    { timestamps: true }
);
module.exports = mongoose.model("User", UserSchema);
