import express from "express";
import { httpLogin, httpRegister } from "./auth.controller";

const authRouter = express.Router();

authRouter.post("/login", httpLogin);
authRouter.post("/register", httpRegister);

export default authRouter;
