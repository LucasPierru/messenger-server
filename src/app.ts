import express from "express";
import cors from "cors";
import api from "./routes/api";
import authMiddleware from "./middleware/authMiddleware";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());
app.use("/v1", api);

export default app;
