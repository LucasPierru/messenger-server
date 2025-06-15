import { startSession } from "mongoose";
import Conversation from "../models/conversations.mongo";
import ConversationUser from "../models/conversationUsers.mongo";

export const createConversation = async ({ name, users }: { name?: string; users: string[] }) => {
  const session = await startSession();
  session.startTransaction();
  try {
    const newConversation = new Conversation({
      name,
      createdAt: new Date(),
    });

    const conversation = await newConversation.save();
    users.forEach(async (userId) => {
      const newConversationUser = new ConversationUser({
        user: userId,
        conversation: conversation._id,
      });
      const conversationUser = newConversationUser.save();
    })
    await session.commitTransaction();
    return { conversation, users, error: null };
  } catch (error) {
    await session.abortTransaction();
    return { conversation: null, users: null, error };
  } finally {
    await session.endSession();
  }
};

export const getLastConversationId = async (userId: string) => {
  try {
    const conversationUsers = await ConversationUser.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(1);

    if (conversationUsers.length === 0) {
      return null;
    }

    return conversationUsers[0].conversation;
  } catch (error) {
    console.error("Error getting last conversation:", error);
    throw error;
  }
}
