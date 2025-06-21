import express from "express";
import { httpCreateConversation, httpCreateMessage, httpGetConversation, httpGetConversations, httpReadConversation } from "./conversation.controller";
import authMiddleware from "../../middleware/authMiddleware";

const conversationRouter = express.Router();

conversationRouter.get("/", authMiddleware, httpGetConversations);
conversationRouter.post("/create", authMiddleware, httpCreateConversation);
conversationRouter.post("/read/:id", authMiddleware, httpReadConversation);
conversationRouter.get("/messages/:id", authMiddleware, httpGetConversation);
conversationRouter.post("/message/create", authMiddleware, httpCreateMessage);

export default conversationRouter;
