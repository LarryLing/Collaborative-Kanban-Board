import type { NextFunction, Response } from "express";
import type { Board, BoardCollaborator, CollaboratorRequest } from "../types";
import db from "../config/db";

export async function verifyRole(
  req: CollaboratorRequest<{ boardId: Board["id"] }>,
  res: Response,
  next: NextFunction,
) {
  if (!req.user) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  const { sub } = req.user;
  const { boardId } = req.params;

  try {
    const [rows] = await db.execute(
      `SELECT *
      FROM boards_collaborators
      WHERE user_id = ? AND board_id = ?
      LIMIT 1`,
      [sub, boardId],
    );

    if (!rows || (rows as BoardCollaborator[]).length === 0) {
      return res.status(404).json({ message: "Not a board collaborator" });
    }

    req.role = (rows as BoardCollaborator[])[0].role;

    next();
  } catch (error) {
    console.error("Error verifying collaborator permissions:", error);

    res.status(500).json({
      message: "Error verifying collaborator permissions",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
