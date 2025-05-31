import express from "express";
import { httpGetProfile, httpSearchProfiles } from "./profile.controller";
import authMiddleware from "../../middleware/authMiddleware";

const profileRouter = express.Router();

profileRouter.get("/", authMiddleware, httpGetProfile);
profileRouter.get("/search", authMiddleware, httpSearchProfiles);

export default profileRouter;
