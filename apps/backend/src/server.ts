import dotenv from "dotenv";

dotenv.config();

import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import boardRoutes from "./routes/boardRoutes";
import listRoutes from "./routes/listRoutes";
import cardRoutes from "./routes/cardRoutes";
import collaboratorRoutes from "./routes/collaboratorRoutes";
import authRouter from "./routes/authRoutes";
import config from "./config/config";
import db from "./config/db";
import { FRONTEND_URL } from "./constants";

const app: Application = express();

app.use(express.json());

interface CorsOptions {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => void;
  methods: string[];
  allowedHeaders: string[];
  credentials: boolean;
  maxAge: number;
}

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [FRONTEND_URL];

    if (allowedOrigins.includes(origin || "") || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400,
};

app.use(cors(corsOptions));

app.use(cookieParser());

let startTime: number;

app.get("/api", async (_req, res) => {
  try {
    let uptime = Math.round((Date.now() - startTime) / 1000);

    const connection = await db.getConnection();
    connection.release();

    res.json({
      status: "running",
      "uptime-in-secs": uptime,
      dbState: "connected",
    });
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
