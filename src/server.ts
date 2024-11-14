import { createServer } from "http";
import jwt from "jsonwebtoken";
import app from "./app";
import { Server, Socket } from "socket.io";
import { mongoConnect } from "./services/mongo";

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const startServer = async () => {
  await mongoConnect();

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

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

  io.on("connection", (socket: Socket) => {
    console.log("User connected", socket.userId);

    socket.on("joinRoom", (room) => {
      console.log(`joined room ${room} ${new Date().toTimeString()}`);
      socket.join(room);
    });

    socket.on("leaveRoom", (room) => {
      console.log(`left room ${room} ${new Date().toTimeString()}`);
      socket.leave(room);
    });

    socket.on("message", (room, message) => {
      console.log({ room, message });
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
