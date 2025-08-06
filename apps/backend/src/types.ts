import { Request } from "express";

export interface AuthRequest<P = any, ResBody = any, ReqBody = any>
  extends Request<P, ResBody, ReqBody> {
  user?: User;
}

export interface CollaboratorRequest<P = any, ResBody = any, ReqBody = any>
  extends AuthRequest<P, ResBody, ReqBody> {
  role?: BoardCollaborator["role"];
}

export type User = {
  sub: string;
  givenName: string;
  familyName: string;
  email: string;
};

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

export type AddCollaboratorBody = Pick<User, "email">;
