import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../types";
import jwtVerifier from "../config/jwtVerifier";

export async function verifyAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        message: "Error verifying auth",
        error: "Authorization bearer not provided",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({
        message: "Error verifying auth",
        error: "Token not provided",
      });
      return;
    }

    const payload = await jwtVerifier.verify(token);

    req.auth = {
      id: payload.sub,
      accessToken: token,
    };

    next();
  } catch (error) {
    console.error("Error verifying auth:", error);

    res.status(401).json({
      message: "Error verifying auth",
      error: "Invalid or expired token",
    });
  }
}
