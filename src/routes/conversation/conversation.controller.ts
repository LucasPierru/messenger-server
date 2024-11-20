import { Request, Response } from "express";
import { createConversation } from "../../services/conversation";
import Conversation from "../../models/conversations.mongo";
import ConversationUser from "../../models/conversationUsers.mongo";
import Message from "../../models/messages.mongo";

export const httpCreateConversation = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const { conversation, conversationUser, error } = await createConversation({ name, userId: req.user!.id });
    if (error) throw error;
    res.status(200).json({ conversation, conversationUser });
  } catch (error) {
    res.status(500).json({ message: "Can't create conversation", error });
  }
};

export const httpGetConversations = async (req: Request, res: Response) => {
  try {
    const conversations = await ConversationUser.find({ user: req.user!.id })
      .populate("conversation")
      .populate("messages");
    res.status(200).json({ conversations });
  } catch (error) {
    res.status(500).json({ message: "Can't get conversations", error });
  }
};

export const httpGetConversation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const messages = await Message.find({ conversation: id }).populate(["conversation", "user"]);
    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ message: "Can't get messages", error });
  }
};
