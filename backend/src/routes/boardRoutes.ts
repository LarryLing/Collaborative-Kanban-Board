import { Router } from "express";
import {
  getAllBoards,
  getBoardById,
  createBoard,
  updateBoard,
  deleteBoard,
} from "../controllers/boardControllers";

const boardRouter: Router = Router();

boardRouter.get("/", getAllBoards);
boardRouter.get("/:boardId", getBoardById);
boardRouter.post("/", createBoard);
boardRouter.patch("/:boardId", updateBoard);
boardRouter.delete("/:boardId", deleteBoard);

export default boardRouter;
