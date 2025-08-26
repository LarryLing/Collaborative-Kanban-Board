import { NextFunction } from "express";

import jwtVerifier from "../config/jwtVerifier.js";
import { AuthRequest, Response } from "../types.js";

export async function verifyAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("Failed to verify auth: Authorization bearer not provided");

      res.status(401).json({
        message: "Failed to verify auth",
        error: "Authorization bearer not provided",
      });

      return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      console.error("Failed to verify auth: Access token not provided in authorization bearer");

      res.status(401).json({
        message: "Failed to verify auth",
        error: "Access token not provided in authorization bearer",
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
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    console.error("Failed to verify auth:", errorMessage);

    res.status(401).json({
      message: "Failed to verify auth",
      error: errorMessage,
    });
  }
}
