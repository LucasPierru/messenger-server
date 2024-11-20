import { startSession } from "mongoose";
import Conversation from "../models/conversations.mongo";
import ConversationUser from "../models/conversationUsers.mongo";

export const createConversation = async ({ name, userId }: { name: string; userId: string }) => {
  const session = await startSession();
  session.startTransaction();
  try {
    const newConversation = new Conversation({
      name,
      createdAt: new Date(),
    });

    const conversation = await newConversation.save();
    const newConversationUser = new ConversationUser({
      user: userId,
      conversation: conversation._id,
    });
    const conversationUser = newConversationUser.save();
    await session.commitTransaction();
    return { conversation, conversationUser, error: null };
  } catch (error) {
    await session.abortTransaction();
    return { conversation: null, conversationUser: null, error };
  } finally {
    await session.endSession();
  }
};
