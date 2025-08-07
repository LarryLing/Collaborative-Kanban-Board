import type { NextFunction, Response } from "express";
import type { AuthRequest } from "../types";
import { CognitoJwtVerifier } from "aws-jwt-verify";

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
      res.status(401).json({ error: "No ID token provided" });
      return;
    }

    if (!process.env.COGNITO_USER_POOL_ID || !process.env.COGNITO_CLIENT_ID) {
      throw new Error("Missing Cognito environment variables");
    }

    const verifier = CognitoJwtVerifier.create({
      userPoolId: process.env.COGNITO_USER_POOL_ID,
      tokenUse: "id",
      clientId: process.env.COGNITO_CLIENT_ID,
    });

    const payload = await verifier.verify(token);

    req.user = {
      id: payload.sub,
      email: payload.email as string,
      givenName: payload.given_name as string,
      familyName: payload.family_name as string,
    };

    next();
  } catch (error) {
    console.error("Error verifying auth:", error);

    res.status(500).json({
      message: "Error verifying auth",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
