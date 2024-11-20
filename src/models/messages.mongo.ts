import mongoose, { SchemaTypes } from "mongoose";
const { Schema, model } = mongoose;

const MessagesSchema = new Schema({
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

const Message = model("Message", MessagesSchema);
export default Message;
