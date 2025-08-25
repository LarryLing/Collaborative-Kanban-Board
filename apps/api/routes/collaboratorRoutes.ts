import { Router } from "express";

import { getAllCollaborators, addCollaborator, removeCollaborator } from "../controllers/collaboratorControllers";
import { verifyAuth } from "../middlewares/authMiddleware";
import { verifyRole } from "../middlewares/collaboratorMiddleware";

const collaboratorRouter: Router = Router();

collaboratorRouter.get("/:boardId", verifyAuth, verifyRole, getAllCollaborators);
collaboratorRouter.post("/:boardId", verifyAuth, verifyRole, addCollaborator);
collaboratorRouter.delete("/:boardId/:collaboratorId", verifyAuth, verifyRole, removeCollaborator);

export default collaboratorRouter;
