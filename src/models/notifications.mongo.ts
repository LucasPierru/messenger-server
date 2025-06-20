import mongoose, { SchemaTypes } from "mongoose";
const { Schema, model } = mongoose;

const NotificationsSchema = new Schema({
  recipient: {
    type: SchemaTypes.ObjectId,
    ref: "User",
    required: false,
  },
  message: {
    type: SchemaTypes.ObjectId,
    ref: "Message",
    required: true,
  },
  type: {
    type: String, enum: ["message", "reaction", "mention", "invite", "other"],
    default: "message",
  },
  read: { type: Boolean, default: false },
  conversation: { type: Schema.Types.ObjectId, ref: "Conversation" }, // context
  createdAt: Date,
});

const Notification = model("Notification", NotificationsSchema);
export default Notification;
