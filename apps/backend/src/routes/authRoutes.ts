import { Router } from "express";
import { deleteUser, getUser } from "../controllers/authController";
import { verifyAuth } from "../middlewares/authMiddleware";

const authRouter: Router = Router();

authRouter.get("/", verifyAuth, getUser);
authRouter.delete("/", verifyAuth, deleteUser);

export default authRouter;
