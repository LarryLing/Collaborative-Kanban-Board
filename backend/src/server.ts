import express, { Application } from "express";
import boardRoutes from "./routes/boardRoutes";
import listRoutes from "./routes/listRoutes";
import cardRoutes from "./routes/cardRoutes";
import collaboratorRoutes from "./routes/collaboratorRoutes";
import authRouter from "./routes/authRoutes";
import config from "./config/config";

const app: Application = express();

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/boards", boardRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/collaborators", collaboratorRoutes);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
