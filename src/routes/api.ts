import express from "express";
import authRouter from "./auth/auth.router";
import conversationRouter from "./conversation/conversation.router";
import profileRouter from "./profile/profile.router";

const api = express.Router();

api.use("/auth", authRouter);
api.use("/conversation", conversationRouter);
api.use("/profile", profileRouter);

export default api;
