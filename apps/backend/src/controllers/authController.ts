import type { Response } from "express";
import type { AuthRequest } from "../types";
import { RowDataPacket, type ResultSetHeader } from "mysql2/promise";
import db from "../config/db";

export async function getUser(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  const { id, givenName, familyName, email } = req.user;

  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT 1
      FROM users
      WHERE id = ?`,
      [id],
    );

    if (!rows || rows.length === 0) {
      await db.execute(
        `INSERT IGNORE INTO users (id, given_name, family_name, email)
        VALUES (?, ?, ?, ?)`,
        [id, givenName, familyName, email],
      );
    }

    res
      .status(200)
      .json({ message: "Successfully retrieved user", user: req.user });
  } catch (error) {
    console.error("Error retrieving user:", error);

    res.status(500).json({
      message: "Error retrieving user",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function deleteUser(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  const { id } = req.user;

  try {
    const [result] = await db.execute<ResultSetHeader>(
      `DELETE FROM users
      WHERE id = ?`,
      [id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Successfully deleted user" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
}
