import mongoose from "mongoose";
import { hashPassword } from "../services/hash";
const { Schema, model, Document } = mongoose;

export type IUser = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  lastActive: Date;
} & Document;

const userSchema = new Schema<IUser>({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  createdAt: Date,
  lastActive: Date,
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hashPassword(this.password);
  }
  next();
});

const User = model<IUser>("User", userSchema);
export default User;
