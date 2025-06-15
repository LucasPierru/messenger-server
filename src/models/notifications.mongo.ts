import mongoose, { SchemaTypes } from "mongoose";
const { Schema, model } = mongoose;

const NotificationsSchema = new Schema({
  status: {
    type: String, enum: ["unread", "read"],
    default: "unread",
  },
  message: {
    type: SchemaTypes.ObjectId,
    ref: "Message",
    required: true,
  },
  type: {
    type: String, enum: ["message", "reaction", "mention"],
    default: "message",
  },
  targetedUser: {
    type: SchemaTypes.ObjectId,
    ref: "User",
    required: false,
  },
  createdAt: Date,
});

const Notification = model("Notification", NotificationsSchema);
export default Notification;
