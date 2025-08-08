import type { NextFunction, Response } from "express";
import type { Board, BoardCollaborator, CollaboratorRequest } from "../types";
import db from "../config/db";

export async function verifyRole(
  req: CollaboratorRequest<{ boardId: Board["id"] }>,
  res: Response,
  next: NextFunction,
) {
  if (!req.sub) {
    res.status(401).json({
      message: "Error verifying role",
      error: "Not authorized",
    });
    return;
  }

  const { boardId } = req.params;

  try {
    const [rows] = await db.execute(
      `SELECT *
      FROM boards_collaborators
      WHERE user_id = ? AND board_id = ?
      LIMIT 1`,
      [req.sub, boardId],
    );

    if (!rows || (rows as BoardCollaborator[]).length === 0) {
      res.status(404).json({
        message: "Error verifying role",
        error: "Not a board collaborator",
      });

      return;
    }

    req.role = (rows as BoardCollaborator[])[0].role;

    next();
  } catch (error) {
    console.error("Error verifying role:", error);

    res.status(500).json({
      message: "Error verifying role",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
