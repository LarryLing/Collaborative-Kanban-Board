import { Router } from "express";
import {
  confirmSignUp,
  deleteUser,
  login,
  logout,
  refreshTokens,
  requestPasswordReset,
  resetPassword,
  signUp,
} from "../controllers/authController";
import { verifyAuth } from "../middlewares/authMiddleware";

const authRouter: Router = Router();

authRouter.put("/reset-password", resetPassword);
authRouter.post("/confirm-signup", confirmSignUp);
authRouter.post("/signup", signUp);
authRouter.post("/login", login);
authRouter.post("/logout", verifyAuth, logout);
authRouter.post("/reset-password", requestPasswordReset);
authRouter.post("/refresh", refreshTokens);
authRouter.delete("/me", verifyAuth, deleteUser);

export default authRouter;
