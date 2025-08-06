import type { Response } from "express";
import type { ResultSetHeader } from "mysql2/promise";
import type {
  AuthRequest,
  Board,
  CollaboratorRequest,
  UpdateBoardBody,
} from "../types";
import db from "../config/db";

export async function getAllBoards(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  const { sub } = req.user;

  try {
    const [rows] = await db.execute(
      `SELECT b.*
      FROM boards b
      INNER JOIN boards_collaborators bc ON b.id = bc.board_id
      WHERE bc.user_id = ?
      ORDER BY b.created_at`,
      [sub],
    );

    res.status(200).json({
      message: "Successfully retrieved boards",
      boards: rows as Board[],
    });
  } catch (error) {
    console.error("Error retrieving boards:", error);

    res.status(500).json({
      message: "Error getting boards",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getBoardById(
  req: AuthRequest<{ boardId: Board["id"] }>,
  res: Response,
) {
  if (!req.user) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  const { sub } = req.user;
  const { boardId } = req.params;

  try {
    const [rows] = await db.execute(
      `SELECT b.*
      FROM boards b
      INNER JOIN boards_collaborators bc ON b.id = bc.board_id
      WHERE bc.user_id = ? AND bc.board_id = ?
      ORDER BY b.created_at
      LIMIT 1`,
      [sub, boardId],
    );

    if (!rows || (rows as Board[]).length === 0) {
      return res.status(404).json({ message: "Board not found" });
    }

    res.status(200).json({
      message: "Successfully retrieved board",
      board: (rows as Board[])[0],
    });
  } catch (error) {
    console.error("Error getting board:", error);

    res.status(500).json({
      message: "Error getting board",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function createBoard(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  const { sub } = req.user;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const now = new Date();
    const currentTimestamp = now.toISOString().slice(0, 19).replace("T", " ");
    const boardId = crypto.randomUUID();

    const board: Board = {
      id: boardId,
      title: "Untitled Board",
      createdAt: currentTimestamp,
    };

    await db.execute(
      `INSERT INTO boards (id, title, created_at)
      VALUES (?, ?, ?)`,
      [board.id, board.title, board.createdAt],
    );

    await db.execute(
      `INSERT INTO boards_collaborators (user_id, board_id, role, joined_at)
      VALUES (?, ?, ?, ?)`,
      [sub, boardId, "Owner", currentTimestamp],
    );

    await connection.commit();
    res.status(201).json({ message: "Successfully created board", board });
  } catch (error) {
    await connection.rollback();

    console.error("Error creating board:", error);

    res.status(500).json({
      message: "Error creating board",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  } finally {
    connection.release();
  }
}

export async function updateBoard(
  req: CollaboratorRequest<{ boardId: Board["id"] }, object, UpdateBoardBody>,
  res: Response,
) {
  if (!req.user) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  if (!req.role) {
    return res.status(401).json({ error: "Role not assigned" });
  }

  const { sub } = req.user;
  const { boardId } = req.params;
  const { title } = req.body;

  try {
    const [result] = await db.execute<ResultSetHeader>(
      `UPDATE boards b
      INNER JOIN boards_collaborators bc ON b.id = bc.board_id
      SET b.title = ?
      WHERE bc.user_id = ? AND bc.board_id = ?`,
      [title, sub, boardId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Board not found" });
    }

    res.status(200).json({ message: "Successfully updated board" });
  } catch (error) {
    console.error("Error updating board:", error);

    res.status(500).json({
      message: "Error updating board",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function deleteBoard(
  req: CollaboratorRequest<{ boardId: string }>,
  res: Response,
) {
  if (!req.user) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  if (!req.role) {
    return res.status(401).json({ error: "Role not assigned" });
  }

  const role = req.role;
  const { boardId } = req.params;

  if (role === "Collaborator") {
    return res.status(403).json({ message: "Invalid permissions" });
  }

  try {
    const [result] = await db.execute<ResultSetHeader>(
      `DELETE FROM boards
      WHERE id = ?`,
      [boardId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Board not found" });
    }

    res.status(200).json({ message: "Successfully deleted board" });
  } catch (error) {
    console.error("Error deleting board:", error);

    res.status(500).json({
      message: "Error deleting board",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
