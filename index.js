const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const MessageSchema = require('./models/message')
const { dbconnect } = require("./database/mangodb");
const dotenv = require("dotenv");
dotenv.config();


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const PORT = 5000
dbconnect()
let onlineUsers = []
// Real-time messaging
io.on('connection', (socket) => {
  console.log('🔵 User Connected:', socket.id);

  // Register user as online
  socket.on('userOnline', (userId) => {
    if (!onlineUsers.find((user) => user.userId === userId)) {
      onlineUsers.push({ userId, socketId: socket.id });
    }
    console.log('✅ Online Users:', onlineUsers);
  });

  // Send message event
  socket.on('sendMessage', async (data) => {
    try {
      dbconnect();
      const { senderId, receiverId, message, fileUrl } = data;
      console.log('📩 Message Received:', data);
      // Ensure senderId and receiverId are not arrays and are strings
      const senderIdStr = Array.isArray(senderId) ? senderId[0] : senderId;
      const receiverIdStr = Array.isArray(receiverId)
        ? receiverId[0]
        : receiverId;

      const finalmsg = await MessageSchema.find({
        $or: [
          { senderId: senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      })
        .populate('senderId', 'username email') // Populate sender details
        .populate('receiverId', 'username email') // Populate receiver details
        .sort({ createdAt: -1 }) // Sort by creation date in descending order
        .limit(1);

      console.log('newMessage', receiverIdStr._id);

      const receiverSocket = onlineUsers.find(
        (user) => user.userId === receiverIdStr._id
      )?.socketId;

      if (receiverSocket) {
        console.log('receiverId', receiverSocket);
        console.log('📨 Sending to Receiver:', receiverSocket);
        console.log("Final message:", finalmsg);


        io.to(receiverSocket).emit('receiveMessage', finalmsg);
      } else {
        console.log('🚫 Receiver Not Online');
      }
    } catch (error) {
      console.error('❌ Error sending message:', error);
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('🔴 User Disconnected:', socket.id);
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    console.log('Updated Online Users:', onlineUsers);
  });
});

server.listen(PORT, () => console.log(`http://localhost:${PORT}`));



