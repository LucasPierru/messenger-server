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
  isEdited: Boolean,
  createdAt: Date,
  content: String,
  media_url: String,
  seenBy: [{ type: Schema.Types.ObjectId, ref: "User" }], // for optional read receipts
});

const Message = model("Message", MessagesSchema);
export default Message;
