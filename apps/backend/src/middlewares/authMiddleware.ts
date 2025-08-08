import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../types";
import { verifier } from "../config/jwt-verifier";

export async function verifyAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies?.session;

    const token = authHeader ? authHeader.split(" ")[1] : cookieToken;

    if (!token) {
      res.status(401).json({
        message: "Error verifying auth",
        error: "No Access token provided",
      });

      return;
    }

    if (!process.env.COGNITO_USER_POOL_ID || !process.env.COGNITO_CLIENT_ID) {
      throw new Error("Missing Cognito environment variables");
    }

    const payload = await verifier.verify(token);

    req.sub = payload.sub;

    next();
  } catch (error) {
    console.error("Error verifying auth:", error);

    res.status(500).json({
      message: "Error verifying auth",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
