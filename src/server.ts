import { createServer } from "http";
const { Server } = require("socket.io");
import app from "./app";
import { Socket } from "socket.io";

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const startServer = async () => {
  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  io.on("connection", (socket: Socket) => {
    console.log("User connected", socket.id, socket.handshake.auth);

    socket.on("joinRoom", (room) => {
      console.log(`joined room ${room}`);
      socket.join(room);
    });

    socket.on("message", (room, message) => {
      io.to(room).emit("message", { userId: socket.userId, message });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected", socket.userId);
    });
  });

  server.listen(4000, () => {
    console.log(`Server running in 4000`);
  });
};

startServer();
