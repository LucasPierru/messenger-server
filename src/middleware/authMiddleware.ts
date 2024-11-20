import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) res.status(401).json({ message: "Access denied" });
  else {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      req.user = decoded as { id: string; email: string };
      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({ message: "Invalid token" });
    }
  }
};

export default authMiddleware;
