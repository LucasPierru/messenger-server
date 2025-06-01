import { Request, Response } from "express";
import { createConversation } from "../../services/conversation";
import Conversation from "../../models/conversations.mongo";
import ConversationUser from "../../models/conversationUsers.mongo";
import Message from "../../models/messages.mongo";
import mongoose from "mongoose";

export const httpCreateConversation = async (req: Request, res: Response) => {
  try {
    const { name, users: usersId } = req.body;
    console.log("Creating conversation with users:", req.body.users);
    const { conversation, users, error } = await createConversation({ name, users: [req.user!.id, ...usersId] });
    if (error) throw error;
    res.status(200).json({ conversation, users });
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({ message: "Can't create conversation", error });
  }
};

export const httpGetConversations = async (req: Request, res: Response) => {
  try {

    const conversationUsers = await ConversationUser.find({ user: req.user!.id }).populate("conversation");
    const conversationsWithLastMessages = await Promise.all(
      conversationUsers.map(async (cu) => {
        const lastMessage = await Message.findOne({ conversation: cu.conversation._id })
          .sort({ createdAt: -1 }) // get latest message
          .limit(1);

        return {
          conversation: cu.conversation,
          lastMessage,
        };
      })
    );
    res.status(200).json({ conversations: conversationsWithLastMessages });
  } catch (error) {
    console.error("Error getting conversations:", error);
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
