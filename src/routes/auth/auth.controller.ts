import { Request, Response } from "express";
import User, { IUser } from "../../models/users.mongo";
import { comparePasswords, hashPassword } from "../../services/hash";
import jwt from "jsonwebtoken";
import { getLastConversationId } from "../../services/conversation";

export const httpLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await comparePasswords(password, user.password))) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }
    const lastConversation = await getLastConversationId(user._id.toString());
    const token = jwt.sign({ id: user?._id, email }, process.env.JWT_SECRET!, { expiresIn: "24h" });
    res.json({ token, user: { id: user._id, email: user.email }, lastConversationId: lastConversation });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed", error });
  }
};

export const httpRegister = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      res.status(400).json({
        error: "Credentials missing",
      });
    }

    if (await User.exists({ email })) {
      res.status(409).json({
        error: "User already exists",
      });
    }

    const newUser = new User({
      email,
      password,
      firstName,
      lastName,
      createdAt: new Date(),
    });

    const user = await newUser.save();
    const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET!, { expiresIn: "24h" });
    res.status(201).json({ token, user: { id: newUser._id, email: newUser.email }, message: "User created successfully" });
  } catch (error) {
    res.status(400).json({ message: "Registration failed", error });
  }
};

export const httpChangePassword = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        error: "Credentials missing",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.findOneAndUpdate({ email }, { password: hashedPassword }, { new: true });

    res.status(201).json({ user, message: "Password changed successfully" });
  } catch (error) {
    res.status(400).json({ message: "Registration failed", error });
  }
};

export const httpCheckAuth = async (req: Request, res: Response) => {
  try {
    res.status(201).json({ user: req.user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed", error });
  }
};
