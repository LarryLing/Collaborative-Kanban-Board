import { Router } from "express";

import {
  getAllCards,
  createCard,
  updateCard,
  updateCardPosition,
  deleteCard,
} from "../controllers/cardControllers.js";
import { verifyAuth } from "../middlewares/authMiddleware.js";
import { verifyRole } from "../middlewares/collaboratorMiddleware.js";

const cardRouter: Router = Router();

cardRouter.get("/:boardId", verifyAuth, verifyRole, getAllCards);
cardRouter.post("/:boardId/:listId", verifyAuth, verifyRole, createCard);
cardRouter.patch("/:boardId/:listId/:cardId", verifyAuth, verifyRole, updateCard);
cardRouter.patch("/:boardId/:listId/:cardId/position", verifyAuth, verifyRole, updateCardPosition);
cardRouter.delete("/:boardId/:listId/:cardId", verifyAuth, verifyRole, deleteCard);

export default cardRouter;
