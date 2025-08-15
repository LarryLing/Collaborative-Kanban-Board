import type { UpdateBoardDialogContextType } from "@/lib/types";
import { createContext } from "react";

export const UpdateBoardDialogContext = createContext<
  UpdateBoardDialogContextType | undefined
>(undefined);
