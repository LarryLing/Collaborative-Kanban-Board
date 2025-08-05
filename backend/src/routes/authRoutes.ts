import { Router } from "express";
import { deleteUser } from "../controllers/authController";

const authRouter: Router = Router();

authRouter.delete("/", deleteUser);

export default authRouter;
