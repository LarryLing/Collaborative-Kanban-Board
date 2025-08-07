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
      WHERE board_id = ?`,
      [boardId],
    );

    res
      .status(200)
      .json({ message: "Successfully retrieved lists", lists: rows as List[] });
  } catch (error) {
    console.error("Error retrieving lists", error);

    res.status(500).json({
      message: "Error retrieving lists",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function createList(
  req: CollaboratorRequest<{ boardId: Board["id"] }, object, CreateListBody>,
  res: Response,
) {
  const { boardId } = req.params;
  const { position } = req.body;

  try {
    const listId = crypto.randomUUID();

    const list: List = {
      id: listId,
      boardId: boardId,
      title: "Untitled List",
      position: position,
    };

    await db.execute(
      `INSERT INTO lists (id, board_id, title, position)
      VALUES (?, ?, ?, ?)`,
      [list.id, list.boardId, list.title, list.position],
    );

    res.status(201).json({ message: "Successfully created list", list });
  } catch (error) {
    console.error("Error creating list", error);

    res.status(500).json({
      message: "Error creating list",
      error: error instanceof Error ? error.message : "Unknown error",
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
      return res.status(404).json({ message: "List not found" });
    }

    res.status(200).json({ message: "Successfully updated list" });
  } catch (error) {
    console.error("Error updating list", error);

    res.status(500).json({
      message: "Error updating list",
      error: error instanceof Error ? error.message : "Unknown error",
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
      return res.status(404).json({ message: "List not found" });
    }

    res.status(200).json({ message: "Successfully updated list position" });
  } catch (error) {
    console.error("Error updating list position", error);

    res.status(500).json({
      message: "Error updating list position",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function deleteList(
  req: CollaboratorRequest<{ boardId: Board["id"]; listId: List["id"] }>,
  res: Response,
) {
  const { boardId, listId } = req.params;

  try {
    const [result] = await db.execute<ResultSetHeader>(
      `DELETE FROM lists
      WHERE id = ? AND board_id = ?`,
      [listId, boardId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "List not found" });
    }

    res.status(200).json({ message: "Successfully deleted list" });
  } catch (error) {
    console.error("Error deleting list", error);

    res.status(500).json({
      message: "Error deleting list",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
