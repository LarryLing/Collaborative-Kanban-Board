import { Request } from "express";

export interface AuthRequest<P = any, ResBody = any, ReqBody = any>
  extends Request<P, ResBody, ReqBody> {
  user?: {
    sub: string;
    email: string;
    givenName: string;
    familyName: string;
  };
}

export type Board = {
  id: string;
  title: string;
  createdAt: string;
};

export type UpdateBoardBody = Pick<Board, "title">;

export type BoardCollaborator = {
  userId: string;
  boardId: string;
  role: "Owner" | "Collaborator";
  joinedAt: string;
};
