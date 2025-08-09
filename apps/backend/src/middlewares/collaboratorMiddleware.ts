import type { NextFunction, Response } from "express";
import type { Board, BoardCollaborator, CollaboratorRequest } from "../types";
import db from "../config/db";

export async function verifyRole(
  req: CollaboratorRequest<{ boardId: Board["id"] }>,
  res: Response,
  next: NextFunction,
) {
  if (!req.auth) {
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

    if (!rows || (rows as BoardCollaborator[]).length === 0) {
      res.status(404).json({
        message: "Failed to verify role",
        error: "User is not a board collaborator",
      });

      return;
    }

    req.role = (rows as BoardCollaborator[])[0].role;

    next();
  } catch (error) {
    console.error("Failed to verify role:", error);

    res.status(500).json({
      message: "Failed to verify role",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
