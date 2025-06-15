import mongoose, { SchemaTypes } from "mongoose";
const { Schema, model } = mongoose;

const MessagesReactionsSchema = new Schema({
  message: {
    type: SchemaTypes.ObjectId,
    ref: "Message",
    required: true,
  },
  user: {
    type: SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  reactionType: String, // e.g., "like", "love", "laugh", etc.
  createdAt: Date,
});

const MessageReaction = model("MessageReaction", MessagesReactionsSchema);
export default MessageReaction;
