import type z from "zod";
import {
  AddCollaboratorSchema,
  ConfirmSignupSchema,
  CreateBoardSchema,
  CreateCardSchema,
  CreateListSchema,
  DeleteAccountSchema,
  ForgotPasswordSchema,
  LoginSchema,
  ResetPasswordSchema,
  SignupSchema,
  UpdateBoardSchema,
  UpdateCardSchema,
  UpdateListSchema,
} from "./schemas";
import type { JwtPayload } from "jwt-decode";
import type {
  QueryObserverResult,
  RefetchOptions,
  UseMutateAsyncFunction,
} from "@tanstack/react-query";
import type { UseFormReturn } from "react-hook-form";
import type { COLLABORATOR, OWNER } from "./constants";

export type Theme = "dark" | "light" | "system";

export interface IDTokenPayload extends JwtPayload {
  email: string;
  given_name: string;
  family_name: string;
}

export type LoginForm = z.infer<typeof LoginSchema>;
export type SignupForm = z.infer<typeof SignupSchema>;
export type ConfirmSignupForm = z.infer<typeof ConfirmSignupSchema>;
export type ForgotPasswordForm = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordForm = z.infer<typeof ResetPasswordSchema>;
export type CreateBoardForm = z.infer<typeof CreateBoardSchema>;
export type UpdateBoardForm = z.infer<typeof UpdateBoardSchema>;
export type DeleteAccountForm = z.infer<typeof DeleteAccountSchema>;
export type CreateListForm = z.infer<typeof CreateListSchema>;
export type UpdateListForm = z.infer<typeof UpdateListSchema>;
export type CreateCardForm = z.infer<typeof CreateCardSchema>;
export type UpdateCardForm = z.infer<typeof UpdateCardSchema>;
export type AddCollaboratorForm = z.infer<typeof AddCollaboratorSchema>;

export type EmailSearchBody = {
  email: string | undefined;
};

export type User = {
  id: string;
  given_name: string;
  family_name: string;
  email: string;
};

export type Board = {
  id: string;
  owner_id: string;
  title: string;
  created_at: string;
};

export type Collaborator = User & {
  role: typeof OWNER | typeof COLLABORATOR;
  joined_at: string;
};

export type List = {
  id: string;
  board_id: string;
  title: string;
  position: string;
};

export type Card = {
  id: string;
  board_id: string;
  list_id: string;
  title: string;
  description: string;
  position: string;
};

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loadUser: () => Promise<void>;
  signUp: (
    given_name: User["given_name"],
    family_name: User["family_name"],
    email: User["email"],
    password: string,
  ) => Promise<void>;
  resendSignUp: (email: User["email"]) => Promise<void>;
  confirmSignUp: (
    email: User["email"],
    confirmationCode: string,
  ) => Promise<void>;
  login: (email: User["email"], password: string) => Promise<void>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: User["email"]) => Promise<void>;
  resetPassword: (
    email: User["email"],
    password: string,
    confirmationCode: string,
  ) => Promise<void>;
  deleteAccount: () => Promise<void>;
};

export type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export type UpdateBoardDialogContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  form: UseFormReturn<
    {
      boardTitle: string;
    },
    unknown,
    {
      boardTitle: string;
    }
  >;
  onSubmit: (values: UpdateBoardForm) => Promise<void>;
  openUpdateBoardDialog: (
    boardId: Board["id"],
    boardTitle: Board["title"],
  ) => void;
};

export type UseBoardsReturnType = {
  boards: Board[] | undefined;
  isLoading: boolean;
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<Board[], Error>>;
  createBoardMutation: UseMutateAsyncFunction<
    void,
    Error,
    {
      boardId: Board["id"];
      boardTitle: Board["title"];
      boardCreatedAt: Board["created_at"];
    },
    {
      prevBoards: Board[];
    }
  >;
  deleteBoardMutation: UseMutateAsyncFunction<
    void,
    Error,
    {
      boardId: Board["id"];
    },
    unknown
  >;
  updateBoardMutation: UseMutateAsyncFunction<
    void,
    Error,
    {
      boardId: Board["id"];
      boardTitle: Board["title"];
    },
    unknown
  >;
};

export type UseCollaboratorDialogReturnType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  boardId: string | null;
  error: string | null;
  collaborators: Collaborator[] | undefined;
  isLoading: boolean;
  removeCollaboratorMutation: UseMutateAsyncFunction<
    void,
    Error,
    {
      boardId: Board["id"];
      collaboratorId: Collaborator["id"];
    },
    unknown
  >;
  form: UseFormReturn<
    {
      email: string;
    },
    unknown,
    {
      email: string;
    }
  >;
  onSubmit: (values: AddCollaboratorForm) => Promise<void>;
  openCollaboratorDialog: (boardId: Board["id"]) => Promise<void>;
};

export type UseUpdateBoardDialogReturnType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  form: UseFormReturn<
    {
      boardTitle: string;
    },
    unknown,
    {
      boardTitle: string;
    }
  >;
  onSubmit: (values: UpdateBoardForm) => Promise<void>;
  openUpdateBoardDialog: (
    boardId: Board["id"],
    boardTitle: Board["title"],
  ) => void;
};

export type UseListsReturnType = {
  lists: List[] | undefined;
  isLoading: boolean;
  createListMutation: UseMutateAsyncFunction<
    void,
    Error,
    {
      boardId: Board["id"];
      listId: List["id"];
      listTitle: List["id"];
      listPosition: List["id"];
    },
    {
      prevLists: List[];
    }
  >;
  deleteListMutation: UseMutateAsyncFunction<
    void,
    Error,
    {
      boardId: Board["id"];
      listId: List["id"];
    },
    unknown
  >;
  updateListMutation: UseMutateAsyncFunction<
    void,
    Error,
    {
      boardId: Board["id"];
      listId: List["id"];
      listTitle: List["title"];
    },
    unknown
  >;
  updateListPositionMutation: UseMutateAsyncFunction<
    void,
    Error,
    {
      boardId: Board["id"];
      listId: List["id"];
      listPosition: List["position"];
    },
    unknown
  >;
};

export type UseCardsReturnType = {
  cardsMap: Map<string, Card[]> | undefined;
  isLoading: boolean;
  createCardMutation: UseMutateAsyncFunction<
    void,
    Error,
    {
      boardId: Board["id"];
      listId: List["id"];
      cardId: Card["id"];
      cardTitle: Card["title"];
      cardDescription: Card["description"];
      cardPosition: Card["position"];
    },
    {
      prevCards: Card[];
    }
  >;
  deleteCardMutation: UseMutateAsyncFunction<
    void,
    Error,
    {
      boardId: Board["id"];
      listId: List["id"];
      cardId: Card["id"];
    },
    {
      prevCards: Card[];
    }
  >;
  updateCardMutation: UseMutateAsyncFunction<
    void,
    Error,
    {
      boardId: Board["id"];
      listId: List["id"];
      cardId: Card["id"];
      cardTitle: Card["title"];
      cardDescription: Card["description"];
    },
    {
      prevCards: List[];
    }
  >;
  updateCardPositionMutation: UseMutateAsyncFunction<
    void,
    Error,
    {
      boardId: Board["id"];
      listId: List["id"];
      cardId: Card["id"];
      cardPosition: Card["position"];
      newListId: List["id"];
    },
    {
      prevCards: List[];
    }
  >;
};

export type UseCreateCardDialogReturnType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  form: UseFormReturn<
    {
      cardTitle: string;
      cardDescription: string;
    },
    unknown,
    {
      cardTitle: string;
      cardDescription: string;
    }
  >;
  onSubmit: (values: CreateCardForm) => Promise<void>;
  openCreateCardDialog: (boardId: Board["id"], listId: List["id"]) => void;
};
