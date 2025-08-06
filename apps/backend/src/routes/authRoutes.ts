import { Router } from "express";
import { deleteUser } from "../controllers/authController";
import { syncUser, verifyAuth } from "../middlewares/authMiddleware";

const authRouter: Router = Router();

authRouter.delete("/", verifyAuth, syncUser, deleteUser);

export default authRouter;
