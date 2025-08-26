import { Request, Response } from "express";
import { JwtPayload } from "jwt-decode";
import { OWNER, COLLABORATOR } from "./constants.js";

export interface IDTokenPayload extends JwtPayload {
  email: string;
  given_name: string;
  family_name: string;
}

export interface AuthRequest<P = any, ResBody = any, ReqBody = any> extends Request<P, ResBody, ReqBody> {
  auth?: {
    id: User["id"];
    accessToken: string;
  };
}

export interface CollaboratorRequest<P = any, ResBody = any, ReqBody = any> extends AuthRequest<P, ResBody, ReqBody> {
  role?: Collaborator["role"];
}

export type { Response };

export type User = {
  id: string;
  given_name: string;
  family_name: string;
  email: string;
};

export type SignUpBody = Pick<User, "given_name" | "family_name" | "email"> & {
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
  owner_id: string;
  title: string;
  created_at: string;
};

export type CreateBoardBody = Pick<Board, "id" | "title" | "created_at">;
export type UpdateBoardBody = Pick<Board, "title">;

export type Collaborator = User & {
  role: typeof OWNER | typeof COLLABORATOR;
  joined_at: string;
};

export type AddCollaboratorBody = Pick<User, "email">;

export type List = {
  id: string;
  board_id: string;
  title: string;
  position: string;
};

export type CreateListBody = Pick<List, "id" | "title" | "position">;
export type UpdateListBody = Pick<List, "title">;
export type UpdateListPositionBody = Pick<List, "position">;

export type Card = {
  id: string;
  board_id: string;
  list_id: string;
  title: string;
  description: string;
  position: string;
};

export type CreateCardBody = Pick<Card, "id" | "title" | "description" | "position">;
export type UpdateCardBody = Pick<Card, "title" | "description">;
export type UpdateCardPositionBody = { newListId: List["id"] } & Pick<Card, "position">;
