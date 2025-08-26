import { Router } from "express";

import { getAllCollaborators, addCollaborator, removeCollaborator } from "../controllers/collaboratorControllers.js";
import { verifyAuth } from "../middlewares/authMiddleware.js";
import { verifyRole } from "../middlewares/collaboratorMiddleware.js";

const collaboratorRouter: Router = Router();

collaboratorRouter.get("/:boardId", verifyAuth, verifyRole, getAllCollaborators);
collaboratorRouter.post("/:boardId", verifyAuth, verifyRole, addCollaborator);
collaboratorRouter.delete("/:boardId/:collaboratorId", verifyAuth, verifyRole, removeCollaborator);

export default collaboratorRouter;
