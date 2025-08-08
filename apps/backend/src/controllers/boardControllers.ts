import type { Response } from "express";
import type { ResultSetHeader } from "mysql2/promise";
import type {
  AuthRequest,
  Board,
  CollaboratorRequest,
  CreateBoardBody,
  UpdateBoardBody,
} from "../types";
import db from "../config/db";

export async function getAllBoards(req: AuthRequest, res: Response) {
  if (!req.sub) {
    res.status(401).json({
      message: "Error retrieving boards",
      error: "Not authorized",
    });
    return;
  }

  try {
    const [rows] = await db.execute(
      `SELECT b.*
      FROM boards b
      INNER JOIN boards_collaborators bc ON b.id = bc.board_id
      WHERE bc.user_id = ?
      ORDER BY b.created_at`,
      [req.sub],
    );

    res.status(200).json({
      message: "Successfully retrieved boards",
      data: rows as Board[],
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
  if (!req.sub) {
    res.status(401).json({
      message: "Error retrieving board",
      error: "Not authorized",
    });
    return;
  }

  const { boardId } = req.params;

  try {
    const [rows] = await db.execute(
      `SELECT b.*
      FROM boards b
      INNER JOIN boards_collaborators bc ON b.id = bc.board_id
      WHERE bc.user_id = ? AND bc.board_id = ?
      LIMIT 1`,
      [req.sub, boardId],
    );

    if (!rows || (rows as Board[]).length === 0) {
      res.status(404).json({
        message: "Error retrieving board",
        error: "Board not found",
      });
      return;
    }

    res.status(200).json({
      message: "Successfully retrieved board",
      data: (rows as Board[])[0],
    });
  } catch (error) {
    console.error("Error retrieving board:", error);

    res.status(500).json({
      message: "Error retrieving board",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function createBoard(
  req: AuthRequest<object, object, CreateBoardBody>,
  res: Response,
) {
  if (!req.sub) {
    res.status(401).json({
      message: "Error creating board",
      error: "Not authorized",
    });
    return;
  }

  const { title } = req.body;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const now = new Date();
    const currentTimestamp = now.toISOString().slice(0, 19).replace("T", " ");
    const boardId = crypto.randomUUID();

    const board: Board = {
      id: boardId,
      ownerId: req.sub,
      title: title,
      createdAt: currentTimestamp,
    };

    await db.execute(
      `INSERT INTO boards (id, owner_id, title, created_at)
      VALUES (?, ?, ?, ?)`,
      [board.id, board.ownerId, board.title, board.createdAt],
    );

    await db.execute(
      `INSERT INTO boards_collaborators (user_id, board_id, role, joined_at)
      VALUES (?, ?, ?, ?)`,
      [req.sub, boardId, "Owner", currentTimestamp],
    );

    await connection.commit();
    res
      .status(201)
      .json({ message: "Successfully created board", data: board });
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
  if (!req.sub) {
    res.status(401).json({
      message: "Error updating board",
      error: "Not authorized",
    });
    return;
  }

  const { boardId } = req.params;
  const { title } = req.body;

  try {
    const [result] = await db.execute<ResultSetHeader>(
      `UPDATE boards b
      INNER JOIN boards_collaborators bc ON b.id = bc.board_id
      SET b.title = ?
      WHERE bc.user_id = ? AND bc.board_id = ?`,
      [title, req.sub, boardId],
    );

    if (result.affectedRows === 0) {
      res.status(404).json({
        message: "Error updating board",
        error: "Board not found",
      });
      return;
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
  if (!req.sub) {
    res.status(401).json({
      message: "Error deleting board",
      error: "Not authorized",
    });
    return;
  }

  if (!req.role) {
    res.status(401).json({
      message: "Error deleting board",
      error: "Role not assigned",
    });
    return;
  }

  const role = req.role;
  const { boardId } = req.params;

  if (role === "Collaborator") {
    res.status(403).json({
      message: "Error deleting board",
      error: "Invalid permissions",
    });
    return;
  }

  try {
    const [result] = await db.execute<ResultSetHeader>(
      `DELETE FROM boards
      WHERE id = ? AND owner_id = ?`,
      [boardId, req.sub],
    );

    if (result.affectedRows === 0) {
      res.status(404).json({
        message: "Error deleting board",
        error: "Board not found",
      });
      return;
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
