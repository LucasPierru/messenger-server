import mongoose from "mongoose";
import { hashPassword } from "../services/hash";
const { Schema, model, Document } = mongoose;

export type IUser = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthday: Date;
  bio: string;
  phoneNumber: string;
  location: string;
  gender: "male" | "female" | "other";
  status: string;
  profileUrl?: string;
  createdAt: Date;
  lastActive: Date;
  isActive?: boolean;
} & Document;

const userSchema = new Schema<IUser>({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  birthday: Date,
  bio: { type: String, default: "" },
  phoneNumber: { type: String },
  location: { type: String },
  gender: { type: String, enum: ["male", "female", "other"] },
  status: { type: String, default: "Hey there! I am using Messenger." },
  profileUrl: String,
  createdAt: Date,
  lastActive: Date,
  isActive: Boolean,
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hashPassword(this.password);
  }
  next();
});

const User = model<IUser>("User", userSchema);
export default User;
