import { startSession } from "mongoose";
import Message from "../models/messages.mongo";
import Conversation from "../models/conversations.mongo";
import ConversationUser from "../models/conversationUsers.mongo";

export type IMessage = {
  userId: string;
  conversationId: string;
  content: string;
  mediaUrl?: string;
};

export const createMessage = async ({ userId, conversationId, content, mediaUrl }: IMessage) => {
  const session = await startSession();
  session.startTransaction();
  try {
    const newMessage = new Message({
      user: userId,
      conversation: conversationId,
      content,
      media_url: mediaUrl,
      createdAt: new Date(),
    });

    const message = await newMessage.save();
    const conversation = await Conversation.findByIdAndUpdate(conversationId, { lastActive: new Date() }, { new: true });
    const conversationUser = await ConversationUser.findOneAndUpdate({ conversationId, user: userId }, {
      lastActive: new Date(),
    }, { new: true });

    // Populate user and conversation after saving
    const populatedMessage = await Message.findById(message._id)
      .populate("user", "-password")
      .populate("conversation");

    const receiverIds = await ConversationUser.find({ conversation: conversationId }).where("_id").ne(userId).distinct("user");

    await session.commitTransaction();
    return { message: populatedMessage, receiverIds: receiverIds, error: null };
  } catch (error) {
    console.error("Error creating message:", error);
    await session.abortTransaction();
    return { message: null, receiverIds: [], error };
  } finally {
    await session.endSession();
  }
};
