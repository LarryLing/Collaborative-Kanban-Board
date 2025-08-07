import { Router } from "express";
import {
  getAllCards,
  createCard,
  updateCard,
  updateCardPosition,
  deleteCard,
} from "../controllers/cardControllers";
import { verifyAuth } from "../middlewares/authMiddleware";
import { verifyRole } from "../middlewares/collaboratorMiddleware";

const cardRouter: Router = Router();

cardRouter.get("/:boardId", verifyAuth, verifyRole, getAllCards);
cardRouter.post("/:boardId/:listId", verifyAuth, verifyRole, createCard);
cardRouter.patch(
  "/:boardId/:listId/:cardId",
  verifyAuth,
  verifyRole,
  updateCard,
);
cardRouter.patch(
  "/:boardId/:listId/:cardId/position",
  verifyAuth,
  verifyRole,
  updateCardPosition,
);
cardRouter.delete(
  "/:boardId/:listId/:cardId",
  verifyAuth,
  verifyRole,
  deleteCard,
);

export default cardRouter;
