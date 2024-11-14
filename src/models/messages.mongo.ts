import mongoose, { SchemaTypes } from "mongoose";
const { Schema, model } = mongoose;

const conversationUserSchema = new Schema({
  conversation: {
    type: SchemaTypes.ObjectId,
    ref: "Conversation",
    required: true,
  },
  user: {
    type: SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: Date,
  content: String,
  media_url: String,
});

const ConversationUser = model("ConversationUser", conversationUserSchema);
export default ConversationUser;
