import { NextFunction } from "express";

import db from "../config/db.js";
import { CollaboratorRequest, Board, Collaborator, Response } from "../types.js";

export async function verifyRole(
  req: CollaboratorRequest<{ boardId: Board["id"] }>,
  res: Response,
  next: NextFunction,
) {
  if (!req.auth) {
    console.error("Failed to verify role: User is not authorized to make request");

    res.status(401).json({
      message: "Failed to verify role",
      error: "User is not authorized to make request",
    });

    return;
  }

  const { id } = req.auth;
  const { boardId } = req.params;

  try {
    const [rows] = await db.execute(
      `SELECT *
      FROM boards_collaborators
      WHERE user_id = ? AND board_id = ?
      LIMIT 1`,
      [id, boardId],
    );

    if (!rows || (rows as Collaborator[]).length === 0) {
      console.error("Failed to verify role: User is not a board collaborator");

      res.status(404).json({
        message: "Failed to verify role",
        error: "User is not a board collaborator",
      });

      return;
    }

    req.role = (rows as Collaborator[])[0].role;

    next();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    console.error("Failed to verify role:", errorMessage);

    res.status(500).json({
      message: "Failed to verify role",
      error: errorMessage,
    });
  }
}
