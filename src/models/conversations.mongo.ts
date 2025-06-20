import mongoose from "mongoose";
const { Schema, model } = mongoose;

const conversationSchema = new Schema({
  name: String,
  pictureUrl: String,
  isGroup: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: Date,
  lastActive: Date,
});

const Conversation = model("Conversation", conversationSchema);
export default Conversation;
