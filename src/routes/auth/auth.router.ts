import express from "express";
import { httpChangePassword, httpCheckAuth, httpLogin, httpRegister } from "./auth.controller";
import authMiddleware from "../../middleware/authMiddleware";

const authRouter = express.Router();

authRouter.post("/login", httpLogin);
authRouter.post("/register", httpRegister);
authRouter.post("/change-password", httpChangePassword);
authRouter.get("/check", authMiddleware, httpCheckAuth);

export default authRouter;
