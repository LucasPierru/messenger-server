import { Request, Response } from "express";
import { createConversation } from "../../services/conversation";
import ConversationUser from "../../models/conversationUsers.mongo";
import Message from "../../models/messages.mongo";
import { createMessage } from "../../services/messages";
import { getReceiverSocketId, io } from "../../services/socket";

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
          lastReadAt: cu.lastReadAt,
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
    const messages = await Message.find({ conversation: id }).sort({ createdAt: -1 }).populate(["conversation", "user"]);
    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ message: "Can't get messages", error });
  }
};

export const httpReadConversation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { readAt } = req.body;
    const conversationUser = await ConversationUser.findOneAndUpdate({ conversation: id, user: req.user!.id }, { lastReadAt: readAt, lastActive: readAt }, { new: true });
    res.status(200).json({ conversationUser });
  } catch (error) {
    res.status(500).json({ conversationUser: "Can't get conversation user", error });
  }
};

export const httpCreateMessage = async (req: Request, res: Response) => {
  try {
    const { conversationId, content } = req.body;
    const { message, receiverIds } = await createMessage({
      userId: req.user!.id,
      conversationId,
      content,
    })

    for (const receiverId of receiverIds) {
      if (receiverId) {
        io.to(receiverId.toString()).emit("newMessage", message);
      }
    }
    res.status(200).json({ message });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Couldn't create message", error });
  }
};
