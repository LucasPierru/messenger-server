import { Request, Response } from "express";
import User, { IUser } from "../../models/users.mongo";
import { comparePasswords } from "../../services/hash";
import jwt from "jsonwebtoken";

export const httpLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await comparePasswords(password, user.password))) {
      res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user?._id, email }, process.env.JWT_SECRET!, { expiresIn: "24h" });
    res.json({ token });
  } catch (error) {
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
    res.status(201).json({ token, message: "User created successfully" });
  } catch (error) {
    res.status(400).json({ message: "Registration failed", error });
  }
};
