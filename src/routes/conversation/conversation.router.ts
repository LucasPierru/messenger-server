import express from "express";
import { httpCreateConversation, httpGetConversation, httpGetConversations } from "./conversation.controller";
import authMiddleware from "../../middleware/authMiddleware";

const conversationRouter = express.Router();

conversationRouter.get("/", authMiddleware, httpGetConversations);
conversationRouter.post("/create", authMiddleware, httpCreateConversation);
conversationRouter.get("/messages/:id", authMiddleware, httpGetConversation);

export default conversationRouter;
