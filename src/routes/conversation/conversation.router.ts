import express from "express";
import { httpCreateConversation, httpGetConversation, httpGetConversations, httpReadConversation } from "./conversation.controller";
import authMiddleware from "../../middleware/authMiddleware";

const conversationRouter = express.Router();

conversationRouter.get("/", authMiddleware, httpGetConversations);
conversationRouter.post("/create", authMiddleware, httpCreateConversation);
conversationRouter.post("/read/:id", authMiddleware, httpReadConversation);
conversationRouter.get("/messages/:id", authMiddleware, httpGetConversation);

export default conversationRouter;
