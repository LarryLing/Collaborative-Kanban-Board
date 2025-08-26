import { ResultSetHeader } from "mysql2/promise";

import db from "../config/db.js";
import {
  CollaboratorRequest,
  Board,
  Card,
  List,
  CreateCardBody,
  UpdateCardBody,
  UpdateCardPositionBody,
  Response,
} from "../types.js";

export async function getAllCards(req: CollaboratorRequest<{ boardId: Board["id"] }>, res: Response) {
  const { boardId } = req.params;

  try {
    const [rows] = await db.execute(
      `SELECT *
      FROM cards
      WHERE board_id = ?`,
      [boardId],
    );

    const sortedLists = (rows as Card[]).sort((a, b) => {
      if (a.position < b.position) return -1;
      if (a.position > b.position) return 1;
      return 0;
    });

    res.status(200).json({ message: "Successfully retrieved cards", data: sortedLists });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    console.error("Failed to retrieve cards", errorMessage);

    res.status(500).json({
      message: "Failed to retrieve cards",
      error: errorMessage,
    });
  }
}

export async function createCard(
  req: CollaboratorRequest<{ boardId: Board["id"]; listId: List["id"] }, object, CreateCardBody>,
  res: Response,
) {
  const { boardId, listId } = req.params;
  const { id, title, description, position } = req.body;

  try {
    await db.execute(
      `INSERT INTO cards (id, board_id, list_id, title, description, position)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [id, boardId, listId, title, description, position],
    );

    res.status(201).json({ message: "Successfully created card" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    console.error("Failed to create card", errorMessage);

    res.status(500).json({
      message: "Failed to create card",
      error: errorMessage,
    });
  }
}

export async function updateCard(
  req: CollaboratorRequest<{ boardId: Board["id"]; listId: List["id"]; cardId: Card["id"] }, object, UpdateCardBody>,
  res: Response,
) {
  const { boardId, listId, cardId } = req.params;
  const { title, description } = req.body;

  try {
    const [result] = await db.execute<ResultSetHeader>(
      `UPDATE cards
      SET title = ?, description = ?
      WHERE id = ? AND list_id = ? AND board_id = ?`,
      [title, description, cardId, listId, boardId],
    );

    if (result.affectedRows === 0) {
      console.error("Failed to update card: Could not find card in database");

      res.status(404).json({
        message: "Failed to update card",
        error: "Could not find card in database",
      });

      return;
    }

    res.status(200).json({ message: "Successfully updated card" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    console.error("Failed to update card", errorMessage);

    res.status(500).json({
      message: "Failed to update card",
      error: errorMessage,
    });
  }
}

export async function updateCardPosition(
  req: CollaboratorRequest<
    { boardId: Board["id"]; listId: List["id"]; cardId: Card["id"] },
    object,
    UpdateCardPositionBody
  >,
  res: Response,
) {
  const { boardId, listId, cardId } = req.params;
  const { newListId, position } = req.body;

  try {
    const [result] = await db.execute<ResultSetHeader>(
      `UPDATE cards
      SET position = ?, list_id = ?
      WHERE id = ? AND list_id = ? AND board_id = ?`,
      [position, newListId, cardId, listId, boardId],
    );

    if (result.affectedRows === 0) {
      console.error("Failed to update card position: Could not find card in database");

      res.status(404).json({
        message: "Failed to update card position",
        error: "Could not find card in database",
      });

      return;
    }

    res.status(200).json({ message: "Successfully updated card position" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    console.error("Failed to update card position", errorMessage);

    res.status(500).json({
      message: "Failed to update card position",
      error: errorMessage,
    });
  }
}

export async function deleteCard(
  req: CollaboratorRequest<{
    boardId: Board["id"];
    listId: List["id"];
    cardId: Card["id"];
  }>,
  res: Response,
) {
  const { boardId, listId, cardId } = req.params;

  try {
    await db.execute<ResultSetHeader>(
      `DELETE FROM cards
      WHERE id = ? AND list_id = ? AND board_id = ?`,
      [cardId, listId, boardId],
    );

    res.status(200).json({ message: "Successfully deleted card" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    console.error("Failed to delete card", errorMessage);

    res.status(500).json({
      message: "Failed to delete card",
      error: errorMessage,
    });
  }
}
