import type { QueryObserverResult, RefetchOptions, UseMutateAsyncFunction } from "@tanstack/react-query";
import type { JwtPayload } from "jwt-decode";
import type { UseFormReturn } from "react-hook-form";
import type z from "zod";

import type { COLLABORATOR, OWNER } from "./constants";

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

export type AddCollaboratorForm = z.infer<typeof AddCollaboratorSchema>;

export type AuthContextType = {
  confirmSignUp: (email: User["email"], confirmationCode: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  loadUser: () => Promise<void>;
  login: (email: User["email"], password: string) => Promise<void>;
  logout: () => Promise<void>;
  requestPasswordReset: (email: User["email"]) => Promise<void>;
  resendSignUp: (email: User["email"]) => Promise<void>;
  resetPassword: (email: User["email"], password: string, confirmationCode: string) => Promise<void>;
  signUp: (
    given_name: User["given_name"],
    family_name: User["family_name"],
    email: User["email"],
    password: string,
  ) => Promise<void>;
  user: null | User;
};

export type Board = {
  created_at: string;
  id: string;
  owner_id: string;
  title: string;
};
export type Card = {
  board_id: string;
  description: string;
  id: string;
  list_id: string;
  position: string;
  title: string;
};
export type Collaborator = User & {
  joined_at: string;
  role: typeof COLLABORATOR | typeof OWNER;
};
export type ConfirmSignupForm = z.infer<typeof ConfirmSignupSchema>;
export type CreateBoardForm = z.infer<typeof CreateBoardSchema>;
export type CreateCardForm = z.infer<typeof CreateCardSchema>;
export type CreateListForm = z.infer<typeof CreateListSchema>;
export type DeleteAccountForm = z.infer<typeof DeleteAccountSchema>;
export type DndData = {
  cards: {
    [cardId: Card["id"]]: Card;
  };
  listOrder: List["id"][];
  lists: {
    [listId: List["id"]]: List & {
      cardIds: Card["id"][];
    };
  };
};
export type EmailSearchBody = {
  email: string | undefined;
};
export type ForgotPasswordForm = z.infer<typeof ForgotPasswordSchema>;
export interface IDTokenPayload extends JwtPayload {
  email: string;
  family_name: string;
  given_name: string;
}
export type List = {
  board_id: string;
  id: string;
  position: string;
  title: string;
};

export type LoginForm = z.infer<typeof LoginSchema>;

export type ResetPasswordForm = z.infer<typeof ResetPasswordSchema>;

export type SignupForm = z.infer<typeof SignupSchema>;

export type Theme = "dark" | "light" | "system";

export type ThemeContextType = {
  setTheme: (theme: Theme) => void;
  theme: Theme;
};

export type UpdateBoardDialogContextType = {
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
  open: boolean;
  openUpdateBoardDialog: (boardId: Board["id"], boardTitle: Board["title"]) => void;
  setOpen: (open: boolean) => void;
};

export type UpdateBoardForm = z.infer<typeof UpdateBoardSchema>;

export type UpdateCardForm = z.infer<typeof UpdateCardSchema>;

export type UpdateListForm = z.infer<typeof UpdateListSchema>;

export type UseBoardsReturnType = {
  boards: Board[] | undefined;
  createBoardMutation: UseMutateAsyncFunction<
    void,
    Error,
    {
      boardCreatedAt: Board["created_at"];
      boardId: Board["id"];
      boardTitle: Board["title"];
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
  isLoading: boolean;
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<Board[], Error>>;
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

export type UseCardsReturnType = {
  cards: Card[] | undefined;
  createCardMutation: UseMutateAsyncFunction<
    void,
    Error,
    {
      boardId: Board["id"];
      cardDescription: Card["description"];
      cardId: Card["id"];
      cardPosition: Card["position"];
      cardTitle: Card["title"];
      listId: List["id"];
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
      cardId: Card["id"];
      listId: List["id"];
    },
    {
      prevCards: Card[];
    }
  >;
  isLoading: boolean;
  updateCardMutation: UseMutateAsyncFunction<
    void,
    Error,
    {
      boardId: Board["id"];
      cardDescription: Card["description"];
      cardId: Card["id"];
      cardTitle: Card["title"];
      listId: List["id"];
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
      cardId: Card["id"];
      cardPosition: Card["position"];
      listId: List["id"];
      newListId: List["id"];
    },
    {
      prevCards: List[];
    }
  >;
};

export type UseCollaboratorDialogReturnType = {
  boardId: null | string;
  collaborators: Collaborator[] | undefined;
  form: UseFormReturn<
    {
      email: string;
    },
    unknown,
    {
      email: string;
    }
  >;
  isLoading: boolean;
  onSubmit: (values: AddCollaboratorForm) => Promise<void>;
  open: boolean;
  openCollaboratorDialog: (boardId: Board["id"]) => Promise<void>;
  removeCollaboratorMutation: UseMutateAsyncFunction<
    void,
    Error,
    {
      boardId: Board["id"];
      collaboratorId: Collaborator["id"];
    },
    unknown
  >;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export type UseCreateCardDialogReturnType = {
  form: UseFormReturn<
    {
      cardDescription: string;
      cardTitle: string;
    },
    unknown,
    {
      cardDescription: string;
      cardTitle: string;
    }
  >;
  onSubmit: (values: CreateCardForm) => Promise<void>;
  open: boolean;
  openCreateCardDialog: (boardId: Board["id"], listId: List["id"]) => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export type UseListsReturnType = {
  createListMutation: UseMutateAsyncFunction<
    void,
    Error,
    {
      boardId: Board["id"];
      listId: List["id"];
      listPosition: List["id"];
      listTitle: List["id"];
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
  isLoading: boolean;
  lists: List[] | undefined;
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

export type User = {
  email: string;
  family_name: string;
  given_name: string;
  id: string;
};

export type UseUpdateBoardDialogReturnType = {
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
  open: boolean;
  openUpdateBoardDialog: (boardId: Board["id"], boardTitle: Board["title"]) => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export type UseUpdateCardDialogReturnType = {
  form: UseFormReturn<
    {
      cardDescription: string;
      cardTitle: string;
    },
    unknown,
    {
      cardDescription: string;
      cardTitle: string;
    }
  >;
  onSubmit: (values: UpdateCardForm) => Promise<void>;
  open: boolean;
  openUpdateCardDialog: (
    boardId: Board["id"],
    listId: List["id"],
    cardId: Card["id"],
    cardTitle: Card["title"],
    cardDescription: Card["description"],
  ) => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
