import type { Response } from "express";
import {
  Board,
  CreateListBody,
  List,
  UpdateListBody,
  UpdateListPositionBody,
  CollaboratorRequest,
} from "../types";
import type { ResultSetHeader } from "mysql2/promise";
import db from "../config/db";

export async function getAllLists(
  req: CollaboratorRequest<{ boardId: Board["id"] }>,
  res: Response,
) {
  const { boardId } = req.params;

  try {
    const [rows] = await db.execute(
      `SELECT *
      FROM lists
      WHERE board_id = ?
      ORDER BY position`,
      [boardId],
    );

    res
      .status(200)
      .json({ message: "Successfully retrieved lists", data: rows as List[] });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    console.error("Failed to retrieve lists", errorMessage);

    res.status(500).json({
      message: "Failed to retrieve lists",
      error: errorMessage,
    });
  }
}

export async function createList(
  req: CollaboratorRequest<{ boardId: Board["id"] }, object, CreateListBody>,
  res: Response,
) {
  const { boardId } = req.params;
  const { title, position } = req.body;

  try {
    const listId = crypto.randomUUID();

    const list: List = {
      id: listId,
      boardId: boardId,
      title: title,
      position: position,
    };

    await db.execute(
      `INSERT INTO lists (id, board_id, title, position)
      VALUES (?, ?, ?, ?)`,
      [list.id, list.boardId, list.title, list.position],
    );

    res.status(201).json({ message: "Successfully created list", data: list });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    console.error("Failed to create list", errorMessage);

    res.status(500).json({
      message: "Failed to create list",
      error: errorMessage,
    });
  }
}

export async function updateList(
  req: CollaboratorRequest<
    { boardId: Board["id"]; listId: List["id"] },
    object,
    UpdateListBody
  >,
  res: Response,
) {
  const { boardId, listId } = req.params;
  const { title } = req.body;

  try {
    const [result] = await db.execute<ResultSetHeader>(
      `UPDATE lists
      SET title = ?
      WHERE id = ? AND board_id = ?`,
      [title, listId, boardId],
    );

    if (result.affectedRows === 0) {
      console.error("Failed to update list: Could not find list in database");

      res.status(404).json({
        message: "Failed to update list",
        error: "Could not find list in database",
      });

      return;
    }

    res.status(200).json({ message: "Successfully updated list" });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    console.error("Failed to update list", errorMessage);

    res.status(500).json({
      message: "Failed to update list",
      error: errorMessage,
    });
  }
}

export async function updateListPosition(
  req: CollaboratorRequest<
    { boardId: Board["id"]; listId: List["id"] },
    object,
    UpdateListPositionBody
  >,
  res: Response,
) {
  const { boardId, listId } = req.params;
  const { position } = req.body;

  try {
    const [result] = await db.execute<ResultSetHeader>(
      `UPDATE lists
      SET position = ?
      WHERE id = ? AND board_id = ?`,
      [position, listId, boardId],
    );

    if (result.affectedRows === 0) {
      console.error(
        "Failed to update list position: Could not find list in database",
      );

      res.status(404).json({
        message: "Failed to update list position",
        error: "Could not find list in database",
      });

      return;
    }

    res.status(200).json({ message: "Successfully updated list position" });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    console.error("Failed to update list position", errorMessage);

    res.status(500).json({
      message: "Failed to update list position",
      error: errorMessage,
    });
  }
}

export async function deleteList(
  req: CollaboratorRequest<{ boardId: Board["id"]; listId: List["id"] }>,
  res: Response,
) {
  const { boardId, listId } = req.params;

  try {
    await db.execute<ResultSetHeader>(
      `DELETE FROM lists
      WHERE id = ? AND board_id = ?`,
      [listId, boardId],
    );

    res.status(200).json({ message: "Successfully deleted list" });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    console.error("Error deleting list", errorMessage);

    res.status(500).json({
      message: "Error deleting list",
      error: errorMessage,
    });
  }
}
