import { Request, Response } from "express";
import User from "../../models/users.mongo";

export const httpGetProfile = async (req: Request, res: Response) => {
  try {
    const profile = await User.findOne({ _id: req.user!.id }).select("-password -__v -_id");
    res.status(200).json({ profile });
  } catch (error) {
    res.status(500).json({ message: "Can't get profile", error });
  }
};

export const httpSearchProfiles = async (req: Request, res: Response) => {
  const { search } = req.query

  try {
    const profiles = await User.find({ $or: [{ firstName: { $regex: search } }, { lastName: { $regex: search } }, { email: { $regex: search } }] }).select("-password -__v");
    res.status(200).json({ profiles });
  } catch (error) {
    res.status(500).json({ message: "Can't find any profiles", error });
  }
};