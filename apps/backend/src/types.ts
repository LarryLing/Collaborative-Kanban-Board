import { Request } from "express";
import { OWNER, COLLABORATOR } from "./constants";
import type { JwtPayload } from "jwt-decode";

export interface IDTokenPayload extends JwtPayload {
  email: string;
  given_name: string;
  family_name: string;
}

export interface AuthRequest<P = any, ResBody = any, ReqBody = any>
  extends Request<P, ResBody, ReqBody> {
  auth?: {
    id: User["id"];
    accessToken: string;
  };
}

export interface CollaboratorRequest<P = any, ResBody = any, ReqBody = any>
  extends AuthRequest<P, ResBody, ReqBody> {
  role?: BoardCollaborator["role"];
}

export type User = {
  id: string;
  givenName: string;
  familyName: string;
  email: string;
};

export type SignUpBody = Pick<User, "givenName" | "familyName" | "email"> & {
  password: string;
};
export type LoginBody = Pick<User, "email"> & { password: string };
export type ConfirmSignUpBody = Pick<User, "email"> & {
  confirmationCode: string;
};
export type PasswordResetBody = Pick<User, "email"> & {
  confirmationCode: string;
  password: string;
};
export type RequestConfirmationCode = Pick<User, "email">;

export type Board = {
  id: string;
  ownerId: string;
  title: string;
  createdAt: string;
};

export type CreateBoardBody = Pick<Board, "title">;
export type UpdateBoardBody = Pick<Board, "title">;

export type BoardCollaborator = {
  userId: string;
  boardId: string;
  role: typeof OWNER | typeof COLLABORATOR;
  joinedAt: string;
};

export type AddCollaboratorBody = Pick<User, "email">;

export type List = {
  id: string;
  boardId: string;
  title: string;
  position: number;
};

export type CreateListBody = Pick<List, "title" | "position">;
export type UpdateListBody = Pick<List, "title">;
export type UpdateListPositionBody = Pick<List, "position">;

export type Card = {
  id: string;
  boardId: string;
  listId: string;
  title: string;
  description: string;
  position: number;
};

export type CreateCardBody = Pick<Card, "title" | "description" | "position">;
export type UpdateCardBody = Pick<Card, "title" | "description">;
export type UpdateCardPositionBody = Pick<Card, "position">;
