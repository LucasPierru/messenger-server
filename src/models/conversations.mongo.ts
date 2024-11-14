import mongoose from "mongoose";
const { Schema, model } = mongoose;

const conversationSchema = new Schema({
  name: String,
  createdAt: Date,
  lastActive: Date,
});

const Conversation = model("Conversation", conversationSchema);
export default Conversation;
