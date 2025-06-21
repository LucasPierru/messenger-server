
import express from "express";
import { mongoConnect } from "./services/mongo";
import { app, server } from "./services/socket"

app.use(express.json());

const startServer = async () => {
  await mongoConnect();

  /* app.get("/", (req, res) => {
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

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message); // ← this is key
    });

    socket.on("joinRoom", (room) => {
      console.log(`joined room ${room} ${new Date().toTimeString()}`);
      socket.join(room);
    });

    socket.on("leaveRoom", (room) => {
      console.log(`left room ${room} ${new Date().toTimeString()}`);
      socket.leave(room);
    });

    socket.on("message", async (room, message) => {
      const { message: newMessage } = await createMessage({ conversationId: message.conversation, userId: message.user, content: message.content, mediaUrl: message.mediaUrl })

      io.to(room).emit("message", { userId: socket.userId, message: newMessage });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected", socket.userId);
    });
  }); */

  server.listen(4000, () => {
    console.log(`Server running in 4000`);
  });
};

startServer();
