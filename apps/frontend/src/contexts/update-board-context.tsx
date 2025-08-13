import type { UpdateBoardContextType } from "@/lib/types";
import { createContext } from "react";

export const UpdateBoardContext = createContext<
  UpdateBoardContextType | undefined
>(undefined);
