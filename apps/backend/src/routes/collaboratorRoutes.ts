import { Router } from "express";
import {
  getAllCollaborators,
  createCollaborator,
  deleteCollaborator,
} from "../controllers/collaboratorControllers";

const collaboratorRouter: Router = Router();

collaboratorRouter.get("/:boardId", getAllCollaborators);
collaboratorRouter.post("/:boardId", createCollaborator);
collaboratorRouter.delete("/:boardId/:collaboratorId", deleteCollaborator);

export default collaboratorRouter;
