import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import app from "../app";
import { createServer } from "http";

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// used to store online users
const userSocketMap: Record<string, string> = {}; // {userId: socketId}

export function getReceiverSocketId(userId: string) {
  return userSocketMap[userId];
}

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; email: string };
    socket.userId = user!.id;
    next();
  } catch (error) {
    next(new Error("authentication error"));
  }
});

io.on("connection", (socket) => {
  const userId = socket.userId!;
  console.log("A user connected", userId);
  socket.join(userId);
  if (userId) userSocketMap[userId] = userId;

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", userId);
    socket.leave(userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, server, app };