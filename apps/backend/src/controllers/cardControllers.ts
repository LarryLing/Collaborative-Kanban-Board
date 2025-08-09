import type { Response } from "express";
import type {
  Board,
  Card,
  CollaboratorRequest,
  CreateCardBody,
  List,
  UpdateCardBody,
  UpdateCardPositionBody,
} from "../types";
import type { ResultSetHeader } from "mysql2/promise";
import db from "../config/db";

export async function getAllCards(
  req: CollaboratorRequest<{ boardId: Board["id"] }>,
  res: Response,
) {
  const { boardId } = req.params;

  try {
    const [rows] = await db.execute(
      `SELECT *
      FROM cards
      WHERE board_id = ?
      ORDER BY list_id, position`,
      [boardId],
    );

    res
      .status(200)
      .json({ message: "Successfully retrieved cards", data: rows as Card[] });
  } catch (error) {
    console.error("Failed to retrieve cards", error);

    res.status(500).json({
      message: "Failed to retrieve cards",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function createCard(
  req: CollaboratorRequest<
    { boardId: Board["id"]; listId: List["id"] },
    object,
    CreateCardBody
  >,
  res: Response,
) {
  const { boardId, listId } = req.params;
  const { title, description, position } = req.body;

  try {
    const cardId = crypto.randomUUID();

    const card: Card = {
      id: cardId,
      boardId: boardId,
      listId: listId,
      title: title,
      description: description,
      position: position,
    };

    await db.execute(
      `INSERT INTO cards (id, board_id, list_id, title, description, position)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        card.id,
        card.boardId,
        card.listId,
        card.title,
        card.description,
        card.position,
      ],
    );

    res.status(201).json({ message: "Successfully created card", data: card });
  } catch (error) {
    console.error("Failed to create card", error);

    res.status(500).json({
      message: "Failed to create card",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function updateCard(
  req: CollaboratorRequest<
    { boardId: Board["id"]; listId: List["id"]; cardId: Card["id"] },
    object,
    UpdateCardBody
  >,
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
      res.status(404).json({
        message: "Failed to update card",
        error: "Could not find card in database",
      });
      return;
    }

    res.status(200).json({ message: "Successfully updated card" });
  } catch (error) {
    console.error("Failed to update card", error);

    res.status(500).json({
      message: "Failed to update card",
      error: error instanceof Error ? error.message : "Unknown error",
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
  const { position } = req.body;

  try {
    const [result] = await db.execute<ResultSetHeader>(
      `UPDATE cards
      SET position = ?
      WHERE id = ? AND list_id = ? AND board_id = ?`,
      [position, cardId, listId, boardId],
    );

    if (result.affectedRows === 0) {
      res.status(404).json({
        message: "Failed to update card position",
        error: "Could not find card in database",
      });
      return;
    }

    res.status(200).json({ message: "Successfully updated card position" });
  } catch (error) {
    console.error("Failed to update card position", error);

    res.status(500).json({
      message: "Failed to update card position",
      error: error instanceof Error ? error.message : "Unknown error",
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
    console.error("Failed to delete card", error);

    res.status(500).json({
      message: "Failed to delete card",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
