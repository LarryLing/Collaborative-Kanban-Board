import { Router } from "express";
import { getAllLists, createList, updateList, updateListPosition, deleteList } from "../controllers/listControllers";
import { verifyAuth } from "../middlewares/authMiddleware";
import { verifyRole } from "../middlewares/collaboratorMiddleware";

const listRouter: Router = Router();

listRouter.get("/:boardId", verifyAuth, verifyRole, getAllLists);
listRouter.post("/:boardId", verifyAuth, verifyRole, createList);
listRouter.patch("/:boardId/:listId", verifyAuth, verifyRole, updateList);
listRouter.patch("/:boardId/:listId/position", verifyAuth, verifyRole, updateListPosition);
listRouter.delete("/:boardId/:listId", verifyAuth, verifyRole, deleteList);

export default listRouter;
