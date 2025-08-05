import { Router } from "express";
import {
  getAllCards,
  createCard,
  updateCard,
  deleteCard,
} from "../controllers/cardControllers";

const cardRouter: Router = Router();

cardRouter.get("/:boardId", getAllCards);
cardRouter.post("/:listId", createCard);
cardRouter.patch("/:cardId", updateCard);
cardRouter.delete("/:cardId", deleteCard);

export default cardRouter;
