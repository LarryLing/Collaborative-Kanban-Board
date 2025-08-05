import express, { Application } from "express";
import dotenv from "dotenv";
import boardRoutes from "./routes/boardRoutes";
import listRoutes from "./routes/listRoutes";
import cardRoutes from "./routes/cardRoutes";
import collaboratorRoutes from "./routes/collaboratorRoutes";
import authRouter from "./routes/authRoutes";
import config from "./config/config";
import kanbanDB from "./services/kanbanDB";

dotenv.config();

const app: Application = express();

app.use(express.json());

let startTime: number;

app.get("/api", (req, res) => {
  try {
    let uptime = Math.round((Date.now() - startTime) / 1000);

    res.json({
      status: "running",
      "uptime-in-secs": uptime,
      dbState: kanbanDB.state,
    });
  } catch (err) {
    res.status(500).json(err);
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
