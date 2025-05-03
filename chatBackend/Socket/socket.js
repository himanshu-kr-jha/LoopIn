import { Server } from "socket.io";
import http from "http";
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
    skipMiddlewares: true,
  },
});

const userSocketMap = {};

// Add authentication middleware
io.use(async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    const user = await User.findById(decoded._id);
    if (!user) {
      return next(new Error("User not found"));
    }
    socket.user = user;
    console.log("Authenticated user:", user._id);
    console.log("socket is connected:", socket.id);
    next();
  } catch (err) {
    next(new Error("Authentication failed"));
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.user._id);
  console.log("New connection:", {
    id: socket.id,
    user: socket.user._id,
    handshake: socket.handshake.auth,
  });

  // Store user's socket ID
  userSocketMap[socket.user._id] = socket.id;

  // Emit online users list
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Listen for sendMessage event from client
  socket.on("sendMessage", (data) => {
    const receiverSocketId = getReceiverSocketId(data.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", data);
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.user._id);
    delete userSocketMap[socket.user._id];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  // Error handling
  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
});

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};
export { app, io, server };
