import { Request, Response } from "express";

export const deleteUser = async (req: Request, res: Response) => {
  try {
    // TODO: Implement database query and cognito call to delete user
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};
