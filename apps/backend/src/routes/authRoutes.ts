import { Router } from "express";
import { deleteUser } from "../controllers/authController";
import { verifyAuth } from "../middlewares/authMiddleware";

const authRouter: Router = Router();

authRouter.delete("/", verifyAuth, deleteUser);

export default authRouter;
