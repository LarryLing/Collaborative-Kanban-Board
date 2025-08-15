import type { CollaboratorDialogContextType } from "@/lib/types";
import { createContext } from "react";

export const CollaboratorDialogContext = createContext<
  CollaboratorDialogContextType | undefined
>(undefined);
