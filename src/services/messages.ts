import { startSession } from "mongoose";
import Message from "../models/messages.mongo";
import Conversation from "../models/conversations.mongo";

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
      createdAt: new Date(),
    });

    const message = await newMessage.save();
    const conversation = await Conversation.findById(conversationId);
    conversation!.lastActive = new Date();
    await conversation?.save();

    await session.commitTransaction();
    return { message, error: null };
  } catch (error) {
    await session.abortTransaction();
    return { message: null, error };
  } finally {
    await session.endSession();
  }
};
