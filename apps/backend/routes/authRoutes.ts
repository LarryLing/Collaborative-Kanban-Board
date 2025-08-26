import { Router } from "express";

import {
  confirmSignUp,
  deleteUser,
  getMe,
  login,
  logout,
  requestPasswordReset,
  resendSignUp,
  resetPassword,
  signUp,
} from "../controllers/authController.js";
import { verifyAuth } from "../middlewares/authMiddleware.js";

const authRouter: Router = Router();

authRouter.get("/me", verifyAuth, getMe);
authRouter.put("/reset-password", resetPassword);
authRouter.post("/confirm-signup", confirmSignUp);
authRouter.post("/signup", signUp);
authRouter.post("/signup/resend", resendSignUp);
authRouter.post("/login", login);
authRouter.post("/logout", verifyAuth, logout);
authRouter.post("/reset-password", requestPasswordReset);
authRouter.delete("/me", verifyAuth, deleteUser);

export default authRouter;
