import { Router } from "express";

import { getAllBoards, getBoardById, createBoard, updateBoard, deleteBoard } from "../controllers/boardControllers";
import { verifyAuth } from "../middlewares/authMiddleware";
import { verifyRole } from "../middlewares/collaboratorMiddleware";

const boardRouter: Router = Router();

boardRouter.get("/", verifyAuth, getAllBoards);
boardRouter.get("/:boardId", verifyAuth, getBoardById);
boardRouter.post("/", verifyAuth, createBoard);
boardRouter.patch("/:boardId", verifyAuth, verifyRole, updateBoard);
boardRouter.delete("/:boardId", verifyAuth, verifyRole, deleteBoard);

export default boardRouter;
