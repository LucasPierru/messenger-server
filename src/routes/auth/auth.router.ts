import express from "express";
import { httpChangePassword, httpLogin, httpRegister } from "./auth.controller";

const authRouter = express.Router();

authRouter.post("/login", httpLogin);
authRouter.post("/register", httpRegister);
authRouter.post("/change-password", httpChangePassword);

export default authRouter;
