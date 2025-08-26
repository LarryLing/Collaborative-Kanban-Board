import { Router } from "express";

import { getAllBoards, getBoardById, createBoard, updateBoard, deleteBoard } from "../controllers/boardControllers.js";
import { verifyAuth } from "../middlewares/authMiddleware.js";
import { verifyRole } from "../middlewares/collaboratorMiddleware.js";

const boardRouter: Router = Router();

boardRouter.get("/", verifyAuth, getAllBoards);
boardRouter.get("/:boardId", verifyAuth, getBoardById);
boardRouter.post("/", verifyAuth, createBoard);
boardRouter.patch("/:boardId", verifyAuth, verifyRole, updateBoard);
boardRouter.delete("/:boardId", verifyAuth, verifyRole, deleteBoard);

export default boardRouter;
