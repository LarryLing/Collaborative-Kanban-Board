import dotenv from "dotenv";

dotenv.config();

import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import db from "./config/db";
import authRouter from "./routes/authRoutes";
import boardRoutes from "./routes/boardRoutes";
import cardRoutes from "./routes/cardRoutes";
import collaboratorRoutes from "./routes/collaboratorRoutes";
import listRoutes from "./routes/listRoutes";
import { FRONTEND_URL } from "./constants";
import config from "./config/config";

const app: Application = express();

app.use(express.json());

app.use(
  cors({
    origin: FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(cookieParser());

let startTime: number;

app.get("/api", async (_req: Request, res: Response) => {
  try {
    const uptime = Math.round((Date.now() - startTime) / 1000);

    const connection = await db.getConnection();
    connection.release();

    res.json({ status: "running", "uptime-in-secs": uptime, dbState: "connected" });
  } catch (err) {
    res.status(500).json({
      status: "error",
      "uptime-in-secs": Math.round((Date.now() - startTime) / 1000),
      dbState: "disconnected",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
});

app.use("/api/auth", authRouter);
app.use("/api/boards", boardRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/collaborators", collaboratorRoutes);

app.listen(config.port, () => {
  startTime = Date.now();
  console.log(`Server running on port ${config.port}`);
});

export default app;
