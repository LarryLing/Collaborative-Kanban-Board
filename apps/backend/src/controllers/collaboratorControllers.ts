import type { Response } from "express";
import type {
  AddCollaboratorBody,
  AuthRequest,
  BoardCollaborator,
  CollaboratorRequest,
  User,
} from "../types";
import db from "../config/db";
import { ResultSetHeader } from "mysql2/promise";

export async function getAllCollaborators(
  req: CollaboratorRequest,
  res: Response,
) {
  const { boardId } = req.params;

  try {
    const [rows] = await db.execute(
      `SELECT *
      FROM boards_collaborators
      WHERE board_id = ?
      ORDER BY joined_at`,
      [boardId],
    );

    res.status(200).json({
      message: "Successfully retrieved collaborators",
      collaborators: rows as BoardCollaborator[],
    });
  } catch (error) {
    console.error("Error retrieving collaborators:", error);

    res.status(500).json({
      message: "Error retrieving collaborators",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function addCollaborator(req: CollaboratorRequest, res: Response) {
  if (!req.role) {
    return res.status(401).json({ error: "Role not assigned" });
  }

  const role = req.role;
  const { boardId } = req.params;
  const { email } = req.body as AddCollaboratorBody;

  if (role === "Collaborator") {
    return res.status(401).json({ error: "Invalid permissions" });
  }

  try {
    const [userRows] = await db.execute(
      `SELECT *
      FROM users
      WHERE email = ?
      LIMIT 1`,
      [email],
    );

    if (!userRows || (userRows as User[]).length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const [collaboratorRows] = await db.execute(
      `SELECT *
      FROM boards_collaborators
      WHERE user_id = ? AND board_id = ?
      LIMIT 1`,
      [(userRows as User[])[0].sub, boardId],
    );

    if (
      collaboratorRows &&
      (collaboratorRows as BoardCollaborator[]).length > 0
    ) {
      return res.status(409).json({ message: "Collaborator already added" });
    }

    const now = new Date();
    const currentTimestamp = now.toISOString().slice(0, 19).replace("T", " ");

    await db.execute(
      `INSERT INTO boards_collaborators (user_id, board_id, role, joined_at)
      VALUES (?, ?, ?, ?)`,
      [(userRows as User[])[0].sub, boardId, "Collaborator", currentTimestamp],
    );

    res.status(201).json({
      message: "Successfully added collaborator",
      user: (userRows as User[])[0],
      collaborator: (collaboratorRows as BoardCollaborator[])[0],
    });
  } catch (error) {
    console.error("Error adding collaborator:", error);

    res.status(500).json({
      message: "Error adding collaborator",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function removeCollaborator(
  req: CollaboratorRequest,
  res: Response,
) {
  if (!req.user) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  if (!req.role) {
    return res.status(401).json({ error: "Role not assigned" });
  }

  const role = req.role;
  const { sub } = req.user;
  const { boardId, collaboratorId } = req.params;

  try {
    switch (role) {
      case "Owner":
        if (sub === collaboratorId) {
          return res
            .status(403)
            .json({ message: "Cannot leave board as the owner" });
        }

        const [removeResult] = await db.execute<ResultSetHeader>(
          `DELETE FROM boards_collaborators
          WHERE user_id = ? AND board_id = ?`,
          [collaboratorId, boardId],
        );

        if (removeResult.affectedRows === 0) {
          return res
            .status(404)
            .json({ message: "Board collaborator not found" });
        }
        break;
      case "Collaborator":
        if (sub !== collaboratorId) {
          return res
            .status(403)
            .json({ message: "Cannot remove other collaborators" });
        }

        const [leaveResult] = await db.execute<ResultSetHeader>(
          `DELETE FROM boards_collaborators
          WHERE user_id = ? AND board_id = ?`,
          [collaboratorId, boardId],
        );

        if (leaveResult.affectedRows === 0) {
          return res
            .status(404)
            .json({ message: "Board collaborator not found" });
        }
        break;
      default:
        return res.status(403).json({ message: "Invalid role" });
    }

    return res
      .status(200)
      .json({ message: "Successfully removed collaborator" });
  } catch (error) {
    console.error("Error removing collaborator:", error);

    res.status(500).json({
      message: "Error removing collaborator",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
