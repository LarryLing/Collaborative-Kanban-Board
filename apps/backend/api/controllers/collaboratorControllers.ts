import type { Response } from "express";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";

import db from "../config/db";
import { COLLABORATOR, OWNER } from "../constants";
import type { CollaboratorRequest, Board, Collaborator, AddCollaboratorBody, User } from "../types";

export async function getAllCollaborators(req: CollaboratorRequest<{ boardId: Board["id"] }>, res: Response) {
  const { boardId } = req.params;

  try {
    const [rows] = await db.execute(
      `SELECT
          u.id,
          u.given_name,
          u.family_name,
          u.email,
          bc.role,
          bc.joined_at
      FROM users u
      INNER JOIN boards_collaborators bc ON u.id = bc.user_id
      WHERE bc.board_id = ?
      ORDER BY bc.joined_at`,
      [boardId],
    );

    res.status(200).json({
      message: "Successfully retrieved collaborators",
      data: rows as Collaborator[],
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    console.error("Failed to retrieve collaborators:", errorMessage);

    res.status(500).json({
      message: "Failed to retrieve collaborators",
      error: errorMessage,
    });
  }
}

export async function addCollaborator(
  req: CollaboratorRequest<{ boardId: Board["id"] }, object, AddCollaboratorBody>,
  res: Response,
) {
  if (!req.role) {
    console.error("Failed to add collaborator: User is not a board owner or collaborator");

    res.status(401).json({
      message: "Failed to add collaborator",
      error: "User is not a board owner or collaborator",
    });

    return;
  }

  const role = req.role;
  const { boardId } = req.params;
  const { email } = req.body;

  if (role === COLLABORATOR) {
    console.error("Failed to add collaborator: Cannot add collaborators without board ownership");

    res.status(401).json({
      message: "Failed to add collaborator",
      error: "Cannot add collaborators without board ownership",
    });

    return;
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
      console.error("Failed to add collaborator: Could not find user");

      res.status(404).json({
        message: "Failed to add collaborator",
        error: "Could not find user",
      });

      return;
    }

    const user = (userRows as User[])[0];

    const [collaboratorRows] = await db.execute<RowDataPacket[]>(
      `SELECT 1
      FROM boards_collaborators
      WHERE user_id = ? AND board_id = ?
      LIMIT 1`,
      [user.id, boardId],
    );

    if (collaboratorRows && collaboratorRows.length > 0) {
      console.error("Failed to add collaborator: Collaborator has already been added");

      res.status(409).json({
        message: "Failed to add collaborator",
        error: "Collaborator has already been added",
      });

      return;
    }

    const now = new Date();
    const currentTimestamp = now.toISOString().slice(0, 19).replace("T", " ");

    await db.execute(
      `INSERT INTO boards_collaborators (user_id, board_id, role, joined_at)
      VALUES (?, ?, ?, ?)`,
      [user.id, boardId, COLLABORATOR, currentTimestamp],
    );

    const collaborator: Collaborator = {
      ...user,
      role: COLLABORATOR,
      joined_at: currentTimestamp,
    };

    res.status(201).json({
      message: "Successfully added collaborator",
      data: collaborator,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    console.error("Failed to add collaborator:", errorMessage);

    res.status(500).json({
      message: "Failed to add collaborator",
      error: errorMessage,
    });
  }
}

export async function removeCollaborator(
  req: CollaboratorRequest<{
    boardId: Board["id"];
    collaboratorId: User["id"];
  }>,
  res: Response,
) {
  if (!req.auth) {
    console.error("Failed to remove collaborator: User is not authorized to make request");

    res.status(401).json({
      message: "Failed to remove collaborator",
      error: "User is not authorized to make request",
    });

    return;
  }

  if (!req.role) {
    console.error("Failed to remove collaborator: User is not a board owner or collaborator");

    res.status(401).json({
      message: "Failed to remove collaborator",
      error: "User is not a board owner or collaborator",
    });

    return;
  }

  const { id } = req.auth;
  const role = req.role;
  const { boardId, collaboratorId } = req.params;

  try {
    const [targetUserRows] = await db.execute<RowDataPacket[]>(
      `SELECT role FROM boards_collaborators
       WHERE user_id = ? AND board_id = ?`,
      [collaboratorId, boardId],
    );

    if (targetUserRows.length > 0 && (targetUserRows[0].role as Collaborator["role"]) === OWNER) {
      console.error("Failed to remove collaborator: Cannot leave board as the owner");

      res.status(403).json({
        message: "Failed to remove collaborator",
        error: "Cannot leave board as the owner",
      });

      return;
    }

    if (role === COLLABORATOR) {
      if (id !== collaboratorId) {
        console.error("Failed to remove collaborator: Cannot remove collaborators without board ownership");

        res.status(403).json({
          message: "Failed to remove collaborator",
          error: "Cannot remove collaborators without board ownership",
        });

        return;
      }
    }

    await db.execute<ResultSetHeader>(
      `DELETE FROM boards_collaborators
       WHERE user_id = ? AND board_id = ?`,
      [collaboratorId, boardId],
    );

    res.status(200).json({ message: "Successfully removed collaborator" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    console.error("Failed to remove collaborator:", errorMessage);

    res.status(500).json({
      message: "Failed to remove collaborator",
      error: errorMessage,
    });
  }
}
