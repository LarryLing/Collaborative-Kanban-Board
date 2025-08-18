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
  role?: Collaborator["role"];
}

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

export type CreateBoardBody = Pick<Board, "title">;
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

export type CreateListBody = Pick<List, "title" | "position">;
export type UpdateListBody = Pick<List, "title">;
export type UpdateListPositionBody = Pick<List, "position">;

export type Card = {
  id: string;
  board_id: string;
  list_id: string;
  title: string;
  description: string;
  position: number;
};

export type CreateCardBody = Pick<Card, "title" | "description" | "position">;
export type UpdateCardBody = Pick<Card, "title" | "description">;
export type UpdateCardPositionBody = Pick<Card, "position">;
