import { Router } from "express";
import {
  getAllLists,
  createList,
  updateList,
  deleteList,
} from "../controllers/listControllers";

const listRouter: Router = Router();

listRouter.get("/:boardId", getAllLists);
listRouter.post("/:boardId", createList);
listRouter.patch("/:listId", updateList);
listRouter.delete("/:listId", deleteList);

export default listRouter;
