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
import { COLLABORATOR, OWNER } from "../constants";

export async function getAllBoards(req: AuthRequest, res: Response) {
  if (!req.auth) {
    res.status(401).json({
      message: "Failed to retrieve boards",
      error: "User is not authorized to make request",
    });
    return;
  }

  const { id } = req.auth;

  try {
    const [rows] = await db.execute(
      `SELECT b.*
      FROM boards b
      INNER JOIN boards_collaborators bc ON b.id = bc.board_id
      WHERE bc.user_id = ?
      ORDER BY b.created_at`,
      [id],
    );

    res.status(200).json({
      message: "Successfully retrieved boards",
      data: rows as Board[],
    });
  } catch (error) {
    console.error("Failed to retrieve boards:", error);

    res.status(500).json({
      message: "Failed to retrieve boards",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getBoardById(
  req: AuthRequest<{ boardId: Board["id"] }>,
  res: Response,
) {
  if (!req.auth) {
    res.status(401).json({
      message: "Failed to retrieve board",
      error: "User is not authorized to make request",
    });
    return;
  }

  const { id } = req.auth;
  const { boardId } = req.params;

  try {
    const [rows] = await db.execute(
      `SELECT b.*
      FROM boards b
      INNER JOIN boards_collaborators bc ON b.id = bc.board_id
      WHERE bc.user_id = ? AND bc.board_id = ?
      LIMIT 1`,
      [id, boardId],
    );

    if (!rows || (rows as Board[]).length === 0) {
      res.status(404).json({
        message: "Failed to retrieve board",
        error: "Could not find board in database",
      });
      return;
    }

    res.status(200).json({
      message: "Successfully retrieved board",
      data: (rows as Board[])[0],
    });
  } catch (error) {
    console.error("Failed to retrieve board:", error);

    res.status(500).json({
      message: "Failed to retrieve board",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function createBoard(
  req: AuthRequest<object, object, CreateBoardBody>,
  res: Response,
) {
  if (!req.auth) {
    res.status(401).json({
      message: "Failed to create board",
      error: "User is not authorized to make request",
    });
    return;
  }

  const { id } = req.auth;
  const { title } = req.body;

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const now = new Date();
    const currentTimestamp = now.toISOString().slice(0, 19).replace("T", " ");
    const boardId = crypto.randomUUID();

    const board: Board = {
      id: boardId,
      ownerId: id,
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
      [id, boardId, OWNER, currentTimestamp],
    );

    await connection.commit();
    res
      .status(201)
      .json({ message: "Successfully created board", data: board });
  } catch (error) {
    await connection.rollback();

    console.error("Failed to create board:", error);

    res.status(500).json({
      message: "Failed to create board",
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
  if (!req.auth) {
    res.status(401).json({
      message: "Failed to update board",
      error: "User is not authorized to make request",
    });
    return;
  }

  const { id } = req.auth;
  const { boardId } = req.params;
  const { title } = req.body;

  try {
    const [result] = await db.execute<ResultSetHeader>(
      `UPDATE boards b
      INNER JOIN boards_collaborators bc ON b.id = bc.board_id
      SET b.title = ?
      WHERE bc.user_id = ? AND bc.board_id = ?`,
      [title, id, boardId],
    );

    if (result.affectedRows === 0) {
      res.status(404).json({
        message: "Failed to update board",
        error: "Could not find board in database",
      });
      return;
    }

    res.status(200).json({ message: "Successfully updated board" });
  } catch (error) {
    console.error("Failed to update board:", error);

    res.status(500).json({
      message: "Failed to update board",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function deleteBoard(
  req: CollaboratorRequest<{ boardId: string }>,
  res: Response,
) {
  if (!req.auth) {
    res.status(401).json({
      message: "Failed to delete board",
      error: "User is not authorized to make request",
    });
    return;
  }

  if (!req.role) {
    res.status(401).json({
      message: "Failed to delete board",
      error: "User is not a board owner or collaborator",
    });
    return;
  }

  const { id } = req.auth;
  const role = req.role;
  const { boardId } = req.params;

  if (role === COLLABORATOR) {
    res.status(403).json({
      message: "Failed to delete board",
      error: "Cannot delete board as a collaborator",
    });
    return;
  }

  try {
    await db.execute<ResultSetHeader>(
      `DELETE FROM boards
      WHERE id = ? AND owner_id = ?`,
      [boardId, id],
    );

    res.status(200).json({ message: "Successfully deleted board" });
  } catch (error) {
    console.error("Failed to delete board:", error);

    res.status(500).json({
      message: "Failed to delete board",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
