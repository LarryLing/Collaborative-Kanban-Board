import type { Response } from "express";
import type { AuthRequest } from "../types";
import type { ResultSetHeader } from "mysql2/promise";
import db from "../config/db";

export async function deleteUser(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  const { sub } = req.user;

  try {
    const [result] = await db.execute<ResultSetHeader>(
      `DELETE FROM users
      WHERE id = ?`,
      [sub],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Successfully deleted user" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
}
